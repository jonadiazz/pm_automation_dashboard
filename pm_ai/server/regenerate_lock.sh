#!/bin/bash

echo "=== Package-lock.json Regeneration Script ==="
echo "This script will completely regenerate the package-lock.json file"
echo ""

# Change to the server directory
cd /workspaces/codespaces-jupyter/pm_ai/server

echo "Current directory: $(pwd)"
echo ""

# Remove existing lock files and node_modules
echo "1. Removing existing package-lock.json files..."
rm -f package-lock.json
rm -f package-lock.json.backup
rm -f package-lock.json.new
echo "✓ Lock files removed"

echo ""
echo "2. Removing node_modules directory..."
rm -rf node_modules
echo "✓ node_modules removed"

echo ""
echo "3. Running npm install to generate fresh package-lock.json..."
npm install

echo ""
echo "4. Checking for required dependencies..."
if [ -f package-lock.json ]; then
    echo "✓ package-lock.json created successfully"

    # Check for debug@4.4.3
    if grep -q '"debug".*"4\.4\.3"' package-lock.json; then
        echo "✓ Found debug@4.4.3"
    else
        echo "⚠ debug@4.4.3 not found, checking what version exists:"
        grep -n '"debug"' package-lock.json | head -5
    fi

    # Check for ms@2.1.3
    if grep -q '"ms".*"2\.1\.3"' package-lock.json; then
        echo "✓ Found ms@2.1.3"
    else
        echo "⚠ ms@2.1.3 not found, checking what version exists:"
        grep -n '"ms"' package-lock.json | head -5
    fi

    # Check for PostgreSQL dependencies
    echo ""
    echo "5. Verifying PostgreSQL dependencies:"
    if grep -q '"pg"' package-lock.json; then
        echo "✓ pg dependency found"
    else
        echo "✗ pg dependency missing!"
    fi

else
    echo "✗ package-lock.json was not created"
fi

echo ""
echo "=== Script completed ==="