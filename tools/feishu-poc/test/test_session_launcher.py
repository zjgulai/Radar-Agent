import importlib.util
import json
import os
import subprocess
import sys
import tempfile
import time
import unittest
from pathlib import Path
from unittest import mock

MODULE = Path(__file__).resolve().parents[1] / 'launch_from_session.py'
spec = importlib.util.spec_from_file_location('session_launcher', MODULE)
launcher = importlib.util.module_from_spec(spec)
spec.loader.exec_module(launcher)

TARGET = 'cli_aa69bd34937adbf7'


def write_synthetic_child(directory, source, name='synthetic_child.py'):
    path = Path(directory) / name
    path.write_text(source, encoding='utf-8')
    return path


class CredentialLookupTests(unittest.TestCase):
    # Break caught: taking credentials from a summary, tool output or wrong app.
    def run_lookup(self, entries):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / 'fixture.jsonl'
            path.write_text('\n'.join(json.dumps(row) for row in entries), encoding='utf-8')
            return launcher.load_requested_credentials(path)

    def entry(self, text, kind='user', role='user'):
        return {'type': kind, 'message': {'role': role, 'content': text}}

    def test_original_user_message_is_accepted(self):
        text = f'先打通：打通 飞书事件回调长链接\nApp ID\n{TARGET}\nApp Secret\nsynthetic-test-only\n'
        self.assertEqual(self.run_lookup([self.entry(text)]),
                         {'appId': TARGET, 'appSecret': 'synthetic-test-only'})

    def test_role_and_prefix_exclude_tool_summary_and_assistant(self):
        text = f'先打通\nApp ID\n{TARGET}\nApp Secret\nsynthetic-test-only'
        for entry in [self.entry(text, 'assistant', 'assistant'),
                      self.entry(text, 'user', 'tool'),
                      self.entry('Summary: ' + text)]:
            with self.assertRaisesRegex(ValueError, '^requested_credential_not_found$'):
                self.run_lookup([entry])

    def test_wrong_app_is_rejected(self):
        with self.assertRaisesRegex(ValueError, '^requested_credential_not_found$'):
            self.run_lookup([self.entry('先打通\nApp ID\nfixture-other-app\nApp Secret\nsynthetic-test-only')])

    def test_text_content_blocks_work(self):
        text = f'先打通\nApp ID\n{TARGET}\nApp Secret\nsynthetic-test-only'
        row = self.entry([{'type': 'text', 'text': text}])
        self.assertEqual(self.run_lookup([row])['appSecret'], 'synthetic-test-only')

    def test_multiple_matching_messages_fail_closed(self):
        text = f'先打通\nApp ID\n{TARGET}\nApp Secret\nsynthetic-test-only'
        with self.assertRaisesRegex(ValueError, '^requested_credential_ambiguous$'):
            self.run_lookup([self.entry(text), self.entry(text)])

    def test_blank_secret_is_not_replaced_by_environment(self):
        with self.assertRaisesRegex(ValueError, '^requested_credential_not_found$'):
            self.run_lookup([self.entry(f'先打通\nApp ID\n{TARGET}\nApp Secret\n')])
    def test_live_child_receives_credentials_only_on_stdin(self):
        import os
        with tempfile.TemporaryDirectory() as directory:
            child = Path(directory) / 'synthetic_child.py'
            child.write_text(
                'import json, os, sys\n'
                'value = json.loads(sys.stdin.read())\n'
                'ok = value.get("appSecret") == "synthetic-test-only"\n'
                'ok = ok and value.get("durationSeconds") == 10\n'
                'ok = ok and "FEISHU_APP_SECRET" not in os.environ\n'
                'ok = ok and "NODE_OPTIONS" not in os.environ\n'
                'ok = ok and "NODE_TLS_REJECT_UNAUTHORIZED" not in os.environ\n'
                'ok = ok and "HTTPS_PROXY" not in os.environ\n'
                'ok = ok and "HTTP_PROXY" not in os.environ\n'
                'ok = ok and "synthetic-test-only" not in " ".join(sys.argv)\n'
                'raise SystemExit(0 if ok else 9)\n', encoding='utf-8')
            synthetic_environment = {
                'FEISHU_APP_SECRET': 'synthetic-other-app-value',
                'NODE_OPTIONS': '--require synthetic-preload',
                'NODE_TLS_REJECT_UNAUTHORIZED': '0',
                'HTTPS_PROXY': 'http://synthetic-proxy.invalid',
                'HTTP_PROXY': 'http://synthetic-proxy.invalid',
            }
            saved = {name: os.environ.get(name) for name in synthetic_environment}
            os.environ.update(synthetic_environment)
            try:
                import sys
                result = launcher.run_child(
                    {'appId': TARGET, 'appSecret': 'synthetic-test-only'},
                    child, duration_seconds=10, executable=sys.executable)
                self.assertEqual(result, 0)
            finally:
                for name, value in saved.items():
                    if value is None:
                        os.environ.pop(name, None)
                    else:
                        os.environ[name] = value


class BoundedTranscriptTests(unittest.TestCase):
    # Break caught: scalar/array JSON rows reaching row.get, unbounded reads,
    # and oversized transcripts silently scanned instead of failing closed.
    def entry(self, text):
        return {'type': 'user', 'message': {'role': 'user', 'content': text}}

    def test_scalar_null_array_and_invalid_utf8_rows_are_skipped(self):
        text = f'先打通\nApp ID\n{TARGET}\nApp Secret\nsynthetic-test-only'
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / 'fixture.jsonl'
            path.write_bytes(b'\n'.join([
                b'null', b'[]', b'42', b'"scalar"', b'true', b'\xff\xfe',
                json.dumps(self.entry(text)).encode('utf-8'),
            ]) + b'\n')
            self.assertEqual(launcher.load_requested_credentials(path)['appSecret'],
                             'synthetic-test-only')

    def test_row_at_8_mib_is_read_but_one_byte_more_fails_closed(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / 'fixture.jsonl'
            path.write_bytes(b'a' * (8 * 1024 * 1024))
            with self.assertRaisesRegex(ValueError, '^requested_credential_not_found$'):
                launcher.load_requested_credentials(path)
            path.write_bytes(b'a' * (8 * 1024 * 1024 + 1))
            with self.assertRaisesRegex(ValueError,
                                        '^requested_credential_transcript_too_large$'):
                launcher.load_requested_credentials(path)

    def test_transcript_at_64_mib_is_read_but_one_byte_more_fails_closed(self):
        row = b'a' * (1024 * 1024 - 1) + b'\n'
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / 'fixture.jsonl'
            with path.open('wb') as sink:
                for _ in range(64):
                    sink.write(row)
            with self.assertRaisesRegex(ValueError, '^requested_credential_not_found$'):
                launcher.load_requested_credentials(path)
            with path.open('ab') as sink:
                sink.write(b'x')
            with self.assertRaisesRegex(ValueError,
                                        '^requested_credential_transcript_too_large$'):
                launcher.load_requested_credentials(path)


class ChildProcessLifecycleTests(unittest.TestCase):
    # Break caught: communicate without a timeout, and terminate/wait leaving a
    # SIGTERM-ignoring child running after the failure has been reported.
    IGNORES_SIGTERM = (
        'import os, signal, time\n'
        'from pathlib import Path\n'
        'signal.signal(signal.SIGTERM, signal.SIG_IGN)\n'
        "Path(__file__).with_suffix('.pid').write_text(str(os.getpid()))\n"
        'time.sleep(60)\n'
    )

    def start_ignoring_child(self, directory):
        child = write_synthetic_child(directory, self.IGNORES_SIGTERM)
        return child, child.with_suffix('.pid')

    def wait_for_pid(self, pid_path):
        deadline = time.monotonic() + 5
        while time.monotonic() < deadline:
            try:
                if pid_path.read_text(encoding='utf-8').strip():
                    return
            except OSError:
                pass
            time.sleep(0.01)
        self.fail('synthetic child did not publish its pid')

    def kill_synthetic_child(self, process):
        """Fallback cleanup for the exact Popen object this test launched."""
        if process is None:
            return
        try:
            if process.poll() is None:
                process.kill()
        except OSError:
            return
        try:
            process.wait(timeout=5)
        except (OSError, subprocess.TimeoutExpired):
            pass

    def assert_process_dead(self, pid_path):
        # Checked before any fallback cleanup: a zombie is still visible to
        # signal 0, so this also catches a child that was killed but not reaped.
        pid = int(pid_path.read_text(encoding='utf-8').strip())
        try:
            os.kill(pid, 0)
        except ProcessLookupError:
            return
        self.fail('run_child returned without terminating and reaping its child')

    def run_against_ignoring_child(self, directory, exception_factory):
        child, pid_path = self.start_ignoring_child(directory)
        seen = {}
        raised = None
        # Assertions run first; this cleanup is the fallback for assertion or
        # error paths and can signal only the Popen object launched for this test.
        self.addCleanup(lambda: self.kill_synthetic_child(seen.get('process')))

        def communicate(process, *args, **kwargs):
            seen['process'] = process
            seen['timeout'] = kwargs.get('timeout')
            self.wait_for_pid(pid_path)
            raise exception_factory(kwargs.get('timeout'))

        try:
            with mock.patch.object(subprocess.Popen, 'communicate',
                                   autospec=True, side_effect=communicate):
                launcher.run_child(
                    {'appId': TARGET, 'appSecret': 'synthetic-test-only'},
                    child, duration_seconds=5, executable=sys.executable)
        except BaseException as error:  # noqa: BLE001 - the test inspects it
            raised = error
        return pid_path, seen, raised

    def test_timeout_kills_ignoring_child_with_fixed_failure(self):
        with tempfile.TemporaryDirectory() as directory:
            pid_path, seen, raised = self.run_against_ignoring_child(
                directory,
                lambda timeout: subprocess.TimeoutExpired(
                    cmd=['synthetic-child'], timeout=timeout))
            self.assertEqual(seen['timeout'], 40)
            self.assertIsInstance(raised, TimeoutError)
            self.assertEqual(str(raised), 'child_process_timeout')
            self.assertNotIn('synthetic-child', str(raised))
            self.assert_process_dead(pid_path)

    def test_startup_budget_tracks_runtime_deadline_with_margin(self):
        # 25s startup (20s runtime discovery+handshake plus 5s margin) and 10s cleanup.
        self.assertEqual(launcher.CHILD_STARTUP_SECONDS, 25)
        self.assertEqual(
            launcher.CHILD_STARTUP_SECONDS + launcher.CHILD_CLEANUP_SECONDS, 35)

    def test_keyboard_interrupt_reaps_child_and_reraises(self):
        with tempfile.TemporaryDirectory() as directory:
            pid_path, _, raised = self.run_against_ignoring_child(
                directory, lambda timeout: KeyboardInterrupt())
            self.assertIsInstance(raised, KeyboardInterrupt)
            self.assert_process_dead(pid_path)

    def test_other_failure_preserves_original_exception_and_reaps_child(self):
        with tempfile.TemporaryDirectory() as directory:
            pid_path, _, raised = self.run_against_ignoring_child(
                directory,
                lambda timeout: OSError('synthetic-communicate-failure'))
            self.assertIsInstance(raised, OSError)
            self.assertEqual(str(raised), 'synthetic-communicate-failure')
            self.assert_process_dead(pid_path)


class CredentialTransferTests(unittest.TestCase):
    # Break caught: default ensure_ascii escaping turns a valid 4096-byte
    # secret into more stdin bytes than the reader accepts.
    def make_child(self, directory, name, secret_expression, minimum, maximum):
        source = (
            'import json, sys\n'
            'raw = sys.stdin.buffer.read()\n'
            'value = json.loads(raw)\n'
            f'ok = value.get("appSecret") == ({secret_expression})\n'
            f'ok = ok and len(raw) <= {maximum}\n'
            'ok = ok and value.get("appId") == "cli_aa69bd34937adbf7"\n'
            'ok = ok and value.get("durationSeconds") == 10\n'
        )
        if minimum is not None:
            source += f'ok = ok and len(raw) > {minimum}\n'
        source += 'raise SystemExit(0 if ok else 9)\n'
        return write_synthetic_child(directory, source, name)

    def test_control_character_secret_transfers_within_stdin_bound(self):
        with tempfile.TemporaryDirectory() as directory:
            child = self.make_child(directory, 'control_child.py',
                                    "'\\u0000' * 4096", 8192, 32768)
            result = launcher.run_child(
                {'appId': TARGET, 'appSecret': '\u0000' * 4096},
                child, duration_seconds=10, executable=sys.executable)
            self.assertEqual(result, 0)

    def test_multibyte_secret_is_not_ascii_escaped_by_transfer(self):
        with tempfile.TemporaryDirectory() as directory:
            child = self.make_child(directory, 'unicode_child.py',
                                    "'\\u00e9' * 2048", None, 8192)
            result = launcher.run_child(
                {'appId': TARGET, 'appSecret': 'é' * 2048},
                child, duration_seconds=10, executable=sys.executable)
            self.assertEqual(result, 0)


if __name__ == '__main__':
    unittest.main()