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
    print(f"Starting Flask backend on port {BACKEND_PORT} ...")
    process = subprocess.Popen(
        [sys.executable, 'app.py'],
        cwd=backend_dir,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    if wait_for_port(BACKEND_PORT, '127.0.0.1', timeout=15):
        print(f"Flask backend started successfully on port {BACKEND_PORT}")
        return process
    else:
        print(f"Failed to start Flask backend. Output:")
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
    print(f"Starting frontend server on port {FRONTEND_PORT} ...")
    if not os.path.exists(frontend_dir):
        print(f"Frontend directory does not exist: {frontend_dir}")
        return None
    process = subprocess.Popen(
        [sys.executable, '-m', 'http.server', str(FRONTEND_PORT)],
        cwd=frontend_dir,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    if wait_for_port(FRONTEND_PORT, '127.0.0.1', timeout=8):
        print(f"Frontend server started successfully on port {FRONTEND_PORT}")
        return process
    else:
        print(f"Failed to start frontend server. Output:")
        try:
            out, err = process.communicate(timeout=2)
            print(out)
            print(err)
        except Exception:
            pass
        process.terminate()
        return None


def main():
    print("\n===== Starting Double Medical Check App =====\n")
    if not os.path.exists(os.path.join(backend_dir, 'app.py')):
        print("app.py not found!")
        return
    if not os.path.exists(frontend_dir):
        print("Frontend directory not found!")
        return

    backend_process = run_backend()
    if not backend_process:
        print("Backend failed to start. Exiting.")
        return

    frontend_process = run_frontend()
    if not frontend_process:
        print("Frontend failed to start. Exiting.")
        backend_process.terminate()
        return

    print("\n===== App started successfully! =====")
    print(f"Frontend: http://localhost:{FRONTEND_PORT}")
    print(f"Backend:  http://localhost:{BACKEND_PORT}")
    print("====================================\n")

    try:
        webbrowser.open(f"http://localhost:{FRONTEND_PORT}")
    except Exception as e:
        print(f"Could not open browser: {e}")

    print("Press Ctrl+C to stop the app.")
    try:
        while True:
            time.sleep(1)
            if backend_process.poll() is not None:
                print("Backend process exited unexpectedly.")
                break
            if frontend_process.poll() is not None:
                print("Frontend process exited unexpectedly.")
                break
    except KeyboardInterrupt:
        print("\nStopping app...")
    finally:
        if backend_process:
            backend_process.terminate()
            print("Backend process stopped.")
        if frontend_process:
            frontend_process.terminate()
            print("Frontend process stopped.")
        print("App fully stopped.")

if __name__ == '__main__':
    main()