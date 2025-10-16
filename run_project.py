import os
import subprocess
import time
from http.server import HTTPServer, SimpleHTTPRequestHandler
import signal

def run_streamlit_app(port, path):
    """Run a Streamlit app in a separate process group."""
    command = ["streamlit", "run", path, "--server.port", str(port), "--server.headless", "true"]
    # preexec_fn=os.setsid is used to create a new process group.
    # This allows us to kill the Streamlit app and all its children.
    return subprocess.Popen(command, preexec_fn=os.setsid)

def main():
    """Start all services."""
    processes = []

    def cleanup(signum, frame):
        print("Signal received, cleaning up processes...")
        for p in processes:
            try:
                # Kill the entire process group
                os.killpg(os.getpgid(p.pid), signal.SIGTERM)
            except ProcessLookupError:
                pass # Process already dead
        if 'httpd' in locals() and httpd:
            httpd.server_close()
        print("Cleanup complete. Exiting.")
        exit(0)

    # Register signal handlers for graceful shutdown
    signal.signal(signal.SIGINT, cleanup)
    signal.signal(signal.SIGTERM, cleanup)

    # Kill any processes that may be running on the ports we need
    for port in [8000, 8501, 8502, 8503]:
        # Using fuser to kill processes on the port. It's more reliable.
        # The `-k` option kills the process, `-n tcp` specifies the namespace.
        subprocess.run(f"fuser -k -n tcp {port}", shell=True, stderr=subprocess.DEVNULL)
        time.sleep(0.5) # Give time for the port to be released

    # Start Streamlit apps
    apps = {
        8501: "KrushiAI-Crop-Recommendation/webapp.py",
        8502: "KrushiAI-Disease-Recognition/main.py",
        8503: "KrushiAI-Fertilizer-Recommendation/fertilizer_app.py",
    }

    for port, path in apps.items():
        processes.append(run_streamlit_app(port, path))
        print(f"Started Streamlit app on port {port}")

    # Start the static web server
    server_address = ("", 8000)
    try:
        httpd = HTTPServer(server_address, SimpleHTTPRequestHandler)
        print("Starting static server on port 8000. Press Ctrl+C to stop.")
        httpd.serve_forever()
    except OSError as e:
        print(f"Error starting static server: {e}")
        # Trigger cleanup if server fails to start
        cleanup(None, None)
    except KeyboardInterrupt:
        print("Keyboard interrupt received.")
        cleanup(None, None)


if __name__ == "__main__":
    main()