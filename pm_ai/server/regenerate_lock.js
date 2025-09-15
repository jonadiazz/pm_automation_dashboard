const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('=== Package-lock.json Regeneration Script ===');
console.log('This script will completely regenerate the package-lock.json file');
console.log('');

// Ensure we're in the right directory
const serverDir = '/workspaces/codespaces-jupyter/pm_ai/server';
process.chdir(serverDir);
console.log(`Current directory: ${process.cwd()}`);
console.log('');

// Step 1: Remove existing lock files
console.log('1. Removing existing package-lock.json files...');
const lockFiles = ['package-lock.json', 'package-lock.json.backup', 'package-lock.json.new'];

lockFiles.forEach(file => {
  try {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
      console.log(`✓ Removed: ${file}`);
    }
  } catch (error) {
    console.log(`⚠ Could not remove ${file}: ${error.message}`);
  }
});

// Step 2: Remove node_modules
console.log('');
console.log('2. Removing node_modules directory...');
try {
  if (fs.existsSync('node_modules')) {
    fs.rmSync('node_modules', { recursive: true, force: true });
    console.log('✓ node_modules removed');
  } else {
    console.log('- node_modules not found');
  }
} catch (error) {
  console.log(`⚠ Could not remove node_modules: ${error.message}`);
}

// Step 3: Run npm install
console.log('');
console.log('3. Running npm install to generate fresh package-lock.json...');
try {
  const result = execSync('npm install', { encoding: 'utf8', stdio: 'inherit' });
  console.log('✓ npm install completed');
} catch (error) {
  console.log(`✗ npm install failed: ${error.message}`);
  process.exit(1);
}

// Step 4: Verify the results
console.log('');
console.log('4. Verifying package-lock.json...');

if (fs.existsSync('package-lock.json')) {
  console.log('✓ package-lock.json created successfully');

  const lockContent = fs.readFileSync('package-lock.json', 'utf8');

  // Check for debug@4.4.3
  if (lockContent.includes('"debug"') && lockContent.includes('4.4.3')) {
    console.log('✓ Found debug@4.4.3');
  } else {
    console.log('⚠ debug@4.4.3 not found, checking what versions exist:');
    const debugMatches = lockContent.match(/"debug":\s*"[^"]*"/g);
    if (debugMatches) {
      debugMatches.slice(0, 5).forEach(match => console.log(`  ${match}`));
    }
  }

  // Check for ms@2.1.3
  if (lockContent.includes('"ms"') && lockContent.includes('2.1.3')) {
    console.log('✓ Found ms@2.1.3');
  } else {
    console.log('⚠ ms@2.1.3 not found, checking what versions exist:');
    const msMatches = lockContent.match(/"ms":\s*"[^"]*"/g);
    if (msMatches) {
      msMatches.slice(0, 5).forEach(match => console.log(`  ${match}`));
    }
  }

  // Check for PostgreSQL dependencies
  console.log('');
  console.log('5. Verifying PostgreSQL dependencies:');
  if (lockContent.includes('"pg"')) {
    console.log('✓ pg dependency found');
  } else {
    console.log('✗ pg dependency missing!');
  }

} else {
  console.log('✗ package-lock.json was not created');
}

console.log('');
console.log('=== Script completed ===');