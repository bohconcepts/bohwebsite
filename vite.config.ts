import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { Plugin } from 'vite';

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

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Set NODE_ENV based on mode
  process.env.NODE_ENV = mode;
  // Load env file based on `mode` in the current working directory.
  // Vite automatically loads environment variables prefixed with VITE_
  // We don't need to manually manage them anymore

  const isProd = mode === 'production';

  return {
    plugins: [react(), removeConsolePlugin()],
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
        'react-leaflet'
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
            utils: ['clsx', 'tailwind-merge', 'class-variance-authority']
          }
        }
      },
      commonjsOptions: {
        include: [/cookie/, /node_modules/]
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
