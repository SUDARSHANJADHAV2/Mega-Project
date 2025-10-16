import os
import subprocess
import time
import signal

def run_streamlit_app(port, path):
    """Run a Streamlit app in a separate process group."""
    command = ["streamlit", "run", path, "--server.port", str(port), "--server.headless", "true"]
    return subprocess.Popen(command, preexec_fn=os.setsid)

def run_fastapi_app(port):
    """Run the FastAPI app using uvicorn."""
    command = ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", str(port), "--reload"]
    return subprocess.Popen(command, preexec_fn=os.setsid)

def main():
    """Start all services."""
    processes = []

    def cleanup(signum, frame):
        print("Signal received, cleaning up processes...")
        for p in processes:
            try:
                os.killpg(os.getpgid(p.pid), signal.SIGTERM)
            except ProcessLookupError:
                pass # Process already dead
        print("Cleanup complete. Exiting.")
        exit(0)

    signal.signal(signal.SIGINT, cleanup)
    signal.signal(signal.SIGTERM, cleanup)

    ports = [8001, 8501, 8502, 8503]
    for port in ports:
        subprocess.run(f"fuser -k -n tcp {port}", shell=True, stderr=subprocess.DEVNULL)
        time.sleep(0.5)

    # Start FastAPI backend
    processes.append(run_fastapi_app(8001))
    print("Started FastAPI backend on port 8001")

    # Start Streamlit apps
    apps = {
        8501: "KrushiAI-Crop-Recommendation/webapp.py",
        8502: "KrushiAI-Disease-Recognition/main.py",
        8503: "KrushiAI-Fertilizer-Recommendation/fertilizer_app.py",
    }

    for port, path in apps.items():
        processes.append(run_streamlit_app(port, path))
        print(f"Started Streamlit app on port {port}")

    # Keep the main process alive
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("Keyboard interrupt received.")
        cleanup(None, None)

if __name__ == "__main__":
    main()