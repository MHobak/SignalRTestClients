import subprocess
import time
import signal
import sys

def get_pod_top(pod_names, namespace):
    """Executes kubectl top pod for each pod."""
    for pod_name in pod_names:
        try:
            result = subprocess.run(
                ["kubectl", "top", "pod", pod_name, "-n", namespace],
                capture_output=True,
                text=True,
                check=True,
            )
            print(result.stdout)
        except subprocess.CalledProcessError as e:
            print(f"Error getting top for pod {pod_name}: {e.stderr}", file=sys.stderr)
        except FileNotFoundError:
            print("kubectl not found. Please ensure kubectl is installed and in your PATH.", file=sys.stderr)
            sys.exit(1)
        except Exception as e:
            print(f"An unexpected error occurred: {e}", file=sys.stderr)

def signal_handler(sig, frame):
    """Handles Ctrl+C to stop the monitoring."""
    print("\nStopping monitoring...")
    sys.exit(0)

def main():
    namespace = "default"  # Replace with your namespace
    pod_names = ["signalr-service-68cd694f5c-qm8l2"]  # Replace with your pod names
    interval_seconds = 5

    if not pod_names:
        print("Please provide one or more pod names.", file=sys.stderr)
        sys.exit(1)

    signal.signal(signal.SIGINT, signal_handler)  # Register Ctrl+C handler

    print("Monitoring pods. Press Ctrl+C to stop.")

    while True:
        get_pod_top(pod_names, namespace)
        time.sleep(interval_seconds)

if __name__ == "__main__":
    main()