# Supabase ESM/CJS Compatibility Fixes

This document summarizes the fixes applied to resolve compatibility issues between ES Modules (ESM) and CommonJS (CJS) modules, specifically focusing on Supabase-related libraries.

## Issues Fixed

1. **`@supabase/postgrest-js` default export error**

   - Error message: "The requested module '/node_modules/@supabase/postgrest-js/dist/cjs/index.js?v=24baea41' does not provide an export named 'default'"
   - Fixed by creating proper shims and aliases in Vite config

2. **`@supabase/auth-js` locks.js syntax error**
   - Error message: "Uncaught SyntaxError: Unexpected token '}'"
   - Fixed by replacing problematic locks.js file with a custom implementation

## Solution Components

### 1. Shim Files

Created custom shims for:

- `supabase-locks-shim.js`: Provides browser and node-compatible lock implementations
- `postgrest/index.js`: Provides proper named and default exports for PostgrestJS
- `cookie-shim.js`: Simple implementation of cookie parsing and serialization
- `set-cookie-parser-shim.js`: Minimal implementation of set-cookie-parser
- `helpers.js`: Implementations for @supabase/auth-js helpers
- `storage/helpers.js`: Implementations for @supabase/storage-js helpers

### 2. Fix Scripts

Enhanced scripts for patching node modules:

- `fix-supabase-auth.js`: Copies shim files to node_modules and patches problematic files
- `deep-clean-build.sh`: Performs a complete cache clean and rebuild

### 3. Vite Config

Updated vite.config.ts with proper aliases to:

- Replace problematic modules with shims
- Handle all possible import paths for the same module
- Ensure consistent exports across different bundling modes

## How to Use

When encountering Supabase ESM/CJS compatibility issues:

1. Run the deep clean build: `./scripts/deep-clean-build.sh`
2. If specific errors persist, check browser console and update the appropriate shim file

## Note on "Multiple GoTrueClient instances" Warning

The warning about multiple GoTrueClient instances is not an error and can be safely ignored as mentioned in the warning itself:

> It is not an error, but this should be avoided as it may produce undefined behavior when used concurrently under the same storage key.

This warning appears when multiple parts of the application initialize separate Supabase client instances.
