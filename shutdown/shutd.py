import time
import subprocess

def shutdown_after(seconds):
    print(f"Shutting down in {seconds} seconds...")
    time.sleep(seconds)
    subprocess.run(['sudo', 'shutdown', '-h', 'now'])

# ensures that the main func is called when this script is run directly
if __name__ == "__main__":
    try:
        shutdown_time = int(input("Enter the shutdown time in seconds: "))
        shutdown_after(shutdown_time)
    except ValueError:
        print("Invalid input. Please enter a valid number of seconds.")
