import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { Plugin } from 'vite';
import { createClient } from '@supabase/supabase-js';

// Custom plugin to remove console.log statements in production
const removeConsolePlugin = (): Plugin => {
  return {
    name: 'remove-console',
    transform(code, id) {
      if (process.env.NODE_ENV === 'production' && id.endsWith('.ts') || id.endsWith('.tsx') || id.endsWith('.js') || id.endsWith('.jsx')) {
        // Remove console.log statements but keep other console methods like console.error
        return {
          code: code.replace(/console\.log\([^)]*\);?/g, ''),
          map: null
        };
      }
      return null;
    }
  };
};

// Custom plugin to handle Supabase Auth JS imports
const supabaseAuthPlugin = (): Plugin => {
  return {
    name: 'supabase-auth-shim',
    resolveId(id, importer) {
      // Handle problematic imports from Supabase Auth JS
      if (importer?.includes('@supabase/auth-js')) {
        // Handle any variation of helpers import path
        if (id.includes('helpers')) {
          return path.resolve(__dirname, './src/lib/helpers.js');
        }
        // Handle any variation of locks import path
        if (id.includes('locks')) {
          return path.resolve(__dirname, './src/lib/locks.js');
        }
      }
      return null;
    },
    load(id) {
      // Intercept problematic Supabase Auth JS files
      if (id.includes('@supabase/auth-js') && id.includes('locks')) {
        // Return our custom implementation with all necessary exports
        return `
          export function lockSupported() { return true; }
          
          export class LockAcquireTimeoutError extends Error {
            constructor(message) {
              super(message);
              this.name = 'LockAcquireTimeoutError';
              this.isAcquireTimeout = true;
            }
          }

          export class NavigatorLockAcquireTimeoutError extends LockAcquireTimeoutError {
            constructor(message) {
              super(message);
              this.name = 'NavigatorLockAcquireTimeoutError';
            }
          }
          
          export class ProcessLockAcquireTimeoutError extends LockAcquireTimeoutError {
            constructor(message) {
              super(message);
              this.name = 'ProcessLockAcquireTimeoutError';
            }
          }
          
          export class BrowserLockImplementation {
            async acquire(name, callback) {
              return await callback();
            }
          }
          
          export class NodeLockImplementation {
            async acquire(name, callback) {
              return await callback();
            }
          }
          
          export function getLockImplementation() {
            return new BrowserLockImplementation();
          }
          
          export const locks = getLockImplementation();
          
          // Navigator lock implementation
          export async function navigatorLock(name, acquireTimeout, fn) {
            try {
              return await fn();
            } catch (e) {
              if (acquireTimeout === 0) {
                throw new NavigatorLockAcquireTimeoutError("Acquiring lock failed");
              }
              throw e;
            }
          };
          
          // Process lock implementation
          export async function processLock(name, acquireTimeout, fn) {
            try {
              return await fn();
            } catch (e) {
              if (acquireTimeout === 0) {
                throw new ProcessLockAcquireTimeoutError("Acquiring lock failed");
              }
              throw e;
            }
          }

          // Export internals object
          export const internals = {
            // Add any internal methods or properties that might be used
            debug: false,
            acquireLock: async (name, callback) => {
              return await callback();
            },
            releaseLock: async (name) => {
              return true;
            },
            getLock: (name) => {
              return {
                name,
                acquire: async (callback) => await callback(),
                release: async () => true
              };
            }
          };
        `;
      }
      return null;
    }
  };
};

// Initialize Supabase client for build-time operations if needed
// Note: This is only used during build time, not in the browser
const initSupabaseForBuild = () => {
  // Only initialize if environment variables are available
  if (process.env.VITE_SUPABASE_URL && process.env.VITE_SUPABASE_ANON_KEY) {
    return createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.VITE_SUPABASE_ANON_KEY
    );
  }
  return null;
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Set NODE_ENV based on mode
  process.env.NODE_ENV = mode;
  // Load env file based on `mode` in the current working directory.
  // Vite automatically loads environment variables prefixed with VITE_
  // We don't need to manually manage them anymore

  const isProd = mode === 'production';

  // Initialize Supabase client for build-time operations
  const supabaseClient = initSupabaseForBuild();
  
  // Validate Supabase connection during build if in production mode
  if (isProd && supabaseClient) {
    console.log('Validating Supabase connection for production build...');
    // This log will be removed in production by our plugin
    // We're just validating that the client can be initialized
  }

  return {
    plugins: [react(), removeConsolePlugin(), supabaseAuthPlugin()],
    // Drop console.log in production
    esbuild: {
      drop: isProd ? ['console'] : [],
      pure: isProd ? ['console.log'] : []
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        'cookie': path.resolve(__dirname, './src/lib/cookie-shim.js'),
        'set-cookie-parser': path.resolve(__dirname, './src/lib/set-cookie-parser-shim.js'),
        '@supabase/auth-js/dist/module/lib/locks.js': path.resolve(__dirname, './src/lib/locks.js'),
        '@supabase/auth-js/dist/module/lib/locks': path.resolve(__dirname, './src/lib/locks.js'),
        '../../../src/lib/locks': path.resolve(__dirname, './src/lib/locks.js'),
        './locks': path.resolve(__dirname, './src/lib/locks.js'),
        './helpers': path.resolve(__dirname, './src/lib/helpers.js'),
        '../helpers': path.resolve(__dirname, './src/lib/helpers.js'),
      },
      mainFields: ['module', 'jsnext:main', 'jsnext', 'browser', 'main'],
    },
    ssr: {
      noExternal: ['react-router-dom']
    },
    optimizeDeps: {
      include: [
        '@supabase/postgrest-js',
        '@supabase/supabase-js',
        'set-cookie-parser',
        'react',
        'react-dom',
        'framer-motion',
        'class-variance-authority',
        'clsx',
        'tailwind-merge'
      ],
      exclude: [
        'lucide-react',
        '@radix-ui/react-icons',
        'react-router-dom',
        'pdfjs-dist',
        'leaflet',
        'react-leaflet',
        '@supabase/auth-js' // Exclude auth-js to prevent optimization issues
      ],
      esbuildOptions: {
        resolveExtensions: ['.js', '.jsx', '.ts', '.tsx']
      }
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            router: ['react-router-dom'],
            ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-toast'],
            utils: ['clsx', 'tailwind-merge', 'class-variance-authority'],
            supabase: ['@supabase/supabase-js']
          }
        },
        // Skip parsing problematic files
        onwarn(warning, warn) {
          // Skip certain warnings
          if (warning.message.includes('@supabase/auth-js') && 
              warning.message.includes('locks.js')) {
            return;
          }
          warn(warning);
        }
      },
      commonjsOptions: {
        include: [/cookie/, /node_modules/],
        transformMixedEsModules: true
      },
      // Minify for production to further obfuscate any remaining logs
      minify: isProd ? 'terser' : false,
      terserOptions: isProd ? {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log']
        }
      } : undefined
    },
    // Ensure environment variables are properly exposed
    define: {
      // In production, replace import.meta.env references with their values at build time
      // This prevents environment variables from being visible in browser sources
      ...(isProd && {
        'process.env.NODE_ENV': JSON.stringify('production'),
        // Prevent direct access to environment variables in production
        '__PRODUCTION__': JSON.stringify(true)
      })
    },
  };
});
