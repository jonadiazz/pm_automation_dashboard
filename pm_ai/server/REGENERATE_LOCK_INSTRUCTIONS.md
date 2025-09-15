# Package-lock.json Regeneration Instructions

## Problem
Railway deployment is failing with "Missing: debug@4.4.3 from lock file" because the current package-lock.json has mismatched dependency versions (debug@4.3.4, 4.3.2, etc. instead of 4.4.3).

## Solution
Completely regenerate package-lock.json with exact dependency resolution.

## Manual Steps

### Option 1: Using the provided Node.js script (Recommended)
```bash
cd /workspaces/codespaces-jupyter/pm_ai/server
node regenerate_lock.js
```

### Option 2: Using the bash script
```bash
cd /workspaces/codespaces-jupyter/pm_ai/server
chmod +x regenerate_lock.sh
./regenerate_lock.sh
```

### Option 3: Using npm script
```bash
cd /workspaces/codespaces-jupyter/pm_ai/server
npm run install:clean
```

### Option 4: Manual commands
```bash
cd /workspaces/codespaces-jupyter/pm_ai/server
rm -f package-lock.json package-lock.json.backup package-lock.json.new
rm -rf node_modules
npm install
```

## Verification Steps

After regeneration, verify the new package-lock.json contains:

1. **debug@4.4.3** (required by Railway)
   ```bash
   grep -n "debug.*4\.4\.3" package-lock.json
   ```

2. **ms@2.1.3** (required by Railway)
   ```bash
   grep -n "ms.*2\.1\.3" package-lock.json
   ```

3. **PostgreSQL dependencies** (pg@^8.11.3)
   ```bash
   grep -n '"pg"' package-lock.json
   ```

## Expected Outcome

- New package-lock.json with lockfileVersion 3
- All transitive dependencies properly resolved
- debug@4.4.3 and ms@2.1.3 present for Railway compatibility
- All PostgreSQL dependencies (pg) maintained

## Files to Clean Up After Success

- `regenerate_lock.js`
- `regenerate_lock.sh`
- `package-lock.json.DELETED`
- `REGENERATE_LOCK_INSTRUCTIONS.md` (this file)
- `temp_cleanup.js`
- `cleanup_locks.py`

## Troubleshooting

If npm install fails:
1. Check Node.js version: `node --version` (should be >=18.0.0)
2. Clear npm cache: `npm cache clean --force`
3. Try with verbose output: `npm install --verbose`