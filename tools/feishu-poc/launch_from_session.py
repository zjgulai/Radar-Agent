"""Local bridge: select the original app request and keep credentials in memory.

No credential values are logged or written. This module has no network calls.
"""
import json
import re
import subprocess
from pathlib import Path

TARGET_APP_ID = 'cli_aa69bd34937adbf7'

MAX_TRANSCRIPT_ROW_BYTES = 8 * 1024 * 1024
MAX_TRANSCRIPT_BYTES = 64 * 1024 * 1024
TRANSCRIPT_TOO_LARGE = 'requested_credential_transcript_too_large'

CHILD_STARTUP_SECONDS = 20
CHILD_CLEANUP_SECONDS = 10
CHILD_TERMINATE_GRACE_SECONDS = 2
CHILD_TIMEOUT = 'child_process_timeout'


def load_requested_credentials(path):
    matches = []
    total_bytes = 0
    with Path(path).open('rb') as source:
        while True:
            line = source.readline(MAX_TRANSCRIPT_ROW_BYTES + 1)
            if not line:
                break
            total_bytes += len(line)
            if len(line) > MAX_TRANSCRIPT_ROW_BYTES or total_bytes > MAX_TRANSCRIPT_BYTES:
                raise ValueError(TRANSCRIPT_TOO_LARGE)
            try:
                row = json.loads(line)
            except ValueError:
                continue
            if not isinstance(row, dict):
                continue
            message = row.get('message', {})
            if row.get('type') != 'user' or not isinstance(message, dict):
                continue
            if message.get('role') != 'user':
                continue
            content = message.get('content', '')
            if isinstance(content, str):
                texts = [content]
            elif isinstance(content, list):
                texts = [block.get('text', '') for block in content
                         if isinstance(block, dict) and block.get('type') == 'text']
            else:
                continue
            for text in texts:
                if not isinstance(text, str) or not text.strip().startswith('先打通'):
                    continue
                found = re.search(
                    r'App ID\s*\n\s*' + re.escape(TARGET_APP_ID)
                    + r'\s*\n\s*App Secret[^\S\n]*\n[^\S\n]*([^\n]+)', text)
                if found and found.group(1).strip():
                    matches.append({'appId': TARGET_APP_ID,
                                    'appSecret': found.group(1).strip()})
    if len(matches) > 1:
        raise ValueError('requested_credential_ambiguous')
    if not matches:
        raise ValueError('requested_credential_not_found')
    return matches[0]


def _close_child_stdin(child):
    pipe = getattr(child, 'stdin', None)
    if pipe is None:
        return
    try:
        pipe.close()
    except OSError:
        pass


def _stop_child(child):
    """Terminate only this child, then force-kill and reap it if unresponsive."""
    try:
        if child.poll() is not None:
            return
        child.terminate()
    except OSError:
        pass
    try:
        child.wait(timeout=CHILD_TERMINATE_GRACE_SECONDS)
        return
    except subprocess.TimeoutExpired:
        pass
    try:
        child.kill()
    except OSError:
        pass
    try:
        child.wait()
    except OSError:
        pass


def _cleanup_child(child):
    try:
        _stop_child(child)
    finally:
        _close_child_stdin(child)


def run_child(credentials, entrypoint, duration_seconds=300, executable='node'):
    import os
    # Do not forward unrelated secret-bearing shell profile variables.
    environment = {name: os.environ[name] for name in
                   ('PATH', 'HOME', 'TMPDIR', 'LANG', 'LC_ALL') if name in os.environ}
    environment['NODE_ENV'] = 'production'
    payload = {'appId': credentials['appId'], 'appSecret': credentials['appSecret'],
               'durationSeconds': duration_seconds}
    # ensure_ascii=False keeps a valid 4096-byte UTF-8 secret from expanding
    # toward the stdin cap; the payload still fits 32768 bytes when escaped.
    stdin_bytes = json.dumps(payload, ensure_ascii=False).encode('utf-8')
    resolved = Path(entrypoint).resolve()
    child = subprocess.Popen([executable, str(resolved)],
                             stdin=subprocess.PIPE, env=environment,
                             cwd=resolved.parent)
    try:
        child.communicate(
            stdin_bytes,
            timeout=duration_seconds + CHILD_STARTUP_SECONDS + CHILD_CLEANUP_SECONDS)
    except subprocess.TimeoutExpired:
        _cleanup_child(child)
        raise TimeoutError(CHILD_TIMEOUT) from None
    except BaseException:
        _cleanup_child(child)
        raise
    return child.returncode


def main():
    import argparse
    parser = argparse.ArgumentParser(description='Start only the requested Radar app PoC; credentials use stdin.')
    parser.add_argument('session_file')
    parser.add_argument('--duration-seconds', type=int, default=300)
    args = parser.parse_args()
    try:
        if not 10 <= args.duration_seconds <= 600:
            raise ValueError('invalid_duration')
        credentials = load_requested_credentials(args.session_file)
        return run_child(credentials, Path(__file__).with_name('run.mjs'), args.duration_seconds)
    except KeyboardInterrupt:
        return 130
    except Exception:
        print(json.dumps({'kind': 'error', 'code': 'credential_launch_failed'}), flush=True)
        return 1


if __name__ == '__main__':
    raise SystemExit(main())