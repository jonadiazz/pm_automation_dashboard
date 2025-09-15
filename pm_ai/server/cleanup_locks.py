#!/usr/bin/env python3
import os
import subprocess
import sys

# Change to the server directory
server_dir = "/workspaces/codespaces-jupyter/pm_ai/server"
os.chdir(server_dir)

# Files to delete
files_to_delete = [
    "package-lock.json",
    "package-lock.json.backup",
    "package-lock.json.new"
]

print("Starting cleanup process...")

# Delete lock files
for file in files_to_delete:
    if os.path.exists(file):
        try:
            os.remove(file)
            print(f"✓ Deleted: {file}")
        except Exception as e:
            print(f"✗ Error deleting {file}: {e}")
    else:
        print(f"- File not found: {file}")

# Delete node_modules if it exists
if os.path.exists("node_modules"):
    try:
        import shutil
        shutil.rmtree("node_modules")
        print("✓ Deleted: node_modules")
    except Exception as e:
        print(f"✗ Error deleting node_modules: {e}")
else:
    print("- node_modules not found")

print("\nRunning npm install...")
try:
    result = subprocess.run(["npm", "install"], capture_output=True, text=True, cwd=server_dir)
    if result.returncode == 0:
        print("✓ npm install completed successfully")
        print(result.stdout)
    else:
        print("✗ npm install failed")
        print("STDOUT:", result.stdout)
        print("STDERR:", result.stderr)
except Exception as e:
    print(f"✗ Error running npm install: {e}")

print("Process completed!")