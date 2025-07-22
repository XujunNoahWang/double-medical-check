import os
import subprocess
import sys
import time
import webbrowser
import socket

BACKEND_PORT = 5000
FRONTEND_PORT = 8080

backend_dir = os.path.dirname(os.path.abspath(__file__))
frontend_dir = os.path.join(backend_dir, 'static')

LANG = os.environ.get('DMC_LANG', 'zh')

MESSAGES = {
    'zh': {
        'starting': '\n===== 启动 Double Medical Check 应用 =====\n',
        'app_py_not_found': '未找到 app.py！',
        'frontend_dir_not_found': '未找到前端目录！',
        'backend_starting': f'启动 Flask 后端，端口 {BACKEND_PORT} ...',
        'backend_started': f'Flask 后端启动成功，端口 {BACKEND_PORT}',
        'backend_failed': 'Flask 后端启动失败，输出：',
        'frontend_starting': f'启动前端静态服务器，端口 {FRONTEND_PORT} ...',
        'frontend_started': f'前端服务器启动成功，端口 {FRONTEND_PORT}',
        'frontend_failed': '前端服务器启动失败，输出：',
        'app_started': '\n===== 应用启动成功！=====',
        'frontend_url': f'前端: http://localhost:{FRONTEND_PORT}',
        'backend_url': f'后端:  http://localhost:{BACKEND_PORT}',
        'press_stop': '按 Ctrl+C 停止应用。',
        'backend_exit': '后端进程意外退出。',
        'frontend_exit': '前端进程意外退出。',
        'stopping': '\n正在停止应用...',
        'backend_stopped': '后端进程已停止。',
        'frontend_stopped': '前端进程已停止。',
        'app_stopped': '应用已完全停止。',
        'browser_fail': '无法打开浏览器: {e}'
    },
    'en': {
        'starting': '\n===== Starting Double Medical Check App =====\n',
        'app_py_not_found': 'app.py not found!',
        'frontend_dir_not_found': 'Frontend directory not found!',
        'backend_starting': f'Starting Flask backend on port {BACKEND_PORT} ...',
        'backend_started': f'Flask backend started successfully on port {BACKEND_PORT}',
        'backend_failed': 'Failed to start Flask backend. Output:',
        'frontend_starting': f'Starting frontend server on port {FRONTEND_PORT} ...',
        'frontend_started': f'Frontend server started successfully on port {FRONTEND_PORT}',
        'frontend_failed': 'Failed to start frontend server. Output:',
        'app_started': '\n===== App started successfully! =====',
        'frontend_url': f'Frontend: http://localhost:{FRONTEND_PORT}',
        'backend_url': f'Backend:  http://localhost:{BACKEND_PORT}',
        'press_stop': 'Press Ctrl+C to stop the app.',
        'backend_exit': 'Backend process exited unexpectedly.',
        'frontend_exit': 'Frontend process exited unexpectedly.',
        'stopping': '\nStopping app...',
        'backend_stopped': 'Backend process stopped.',
        'frontend_stopped': 'Frontend process stopped.',
        'app_stopped': 'App fully stopped.',
        'browser_fail': 'Could not open browser: {e}'
    }
}

T = MESSAGES[LANG]


def is_port_open(port, host='127.0.0.1'):
    """Check if a port is open on the given host."""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.settimeout(0.5)
        try:
            s.connect((host, port))
            return True
        except Exception:
            return False


def wait_for_port(port, host='127.0.0.1', timeout=15):
    """Wait until the port is open or timeout (seconds)."""
    start = time.time()
    while time.time() - start < timeout:
        if is_port_open(port, host):
            return True
        time.sleep(1)
    return False


def run_backend():
    """Start Flask backend."""
    print(T['backend_starting'])
    process = subprocess.Popen(
        [sys.executable, 'app.py'],
        cwd=backend_dir,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    if wait_for_port(BACKEND_PORT, '127.0.0.1', timeout=15):
        print(T['backend_started'])
        return process
    else:
        print(T['backend_failed'])
        try:
            out, err = process.communicate(timeout=2)
            print(out)
            print(err)
        except Exception:
            pass
        process.terminate()
        return None


def run_frontend():
    """Start frontend static server."""
    print(T['frontend_starting'])
    if not os.path.exists(frontend_dir):
        print(T['frontend_dir_not_found'])
        return None
    process = subprocess.Popen(
        [sys.executable, '-m', 'http.server', str(FRONTEND_PORT)],
        cwd=frontend_dir,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    if wait_for_port(FRONTEND_PORT, '127.0.0.1', timeout=8):
        print(T['frontend_started'])
        return process
    else:
        print(T['frontend_failed'])
        try:
            out, err = process.communicate(timeout=2)
            print(out)
            print(err)
        except Exception:
            pass
        process.terminate()
        return None


def main():
    print(T['starting'])
    if not os.path.exists(os.path.join(backend_dir, 'app.py')):
        print(T['app_py_not_found'])
        return
    if not os.path.exists(frontend_dir):
        print(T['frontend_dir_not_found'])
        return

    backend_process = run_backend()
    if not backend_process:
        print(T['backend_failed'])
        return

    frontend_process = run_frontend()
    if not frontend_process:
        print(T['frontend_failed'])
        backend_process.terminate()
        return

    print(T['app_started'])
    print(T['frontend_url'])
    print(T['backend_url'])
    print("====================================\n")

    try:
        webbrowser.open(f"http://localhost:{FRONTEND_PORT}")
    except Exception as e:
        print(T['browser_fail'].format(e=e))

    print(T['press_stop'])
    try:
        while True:
            time.sleep(1)
            if backend_process.poll() is not None:
                print(T['backend_exit'])
                break
            if frontend_process.poll() is not None:
                print(T['frontend_exit'])
                break
    except KeyboardInterrupt:
        print(T['stopping'])
    finally:
        if backend_process:
            backend_process.terminate()
            print(T['backend_stopped'])
        if frontend_process:
            frontend_process.terminate()
            print(T['frontend_stopped'])
        print(T['app_stopped'])

if __name__ == '__main__':
    main()