import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(() => {
  // Load env file based on `mode` in the current working directory.
  // Vite automatically loads environment variables prefixed with VITE_
  // We don't need to manually manage them anymore

  return {
    plugins: [react()],
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
      }
    },
    // Ensure environment variables are properly exposed
    define: {
      // Environment variables are automatically available through import.meta.env
      // but we can define additional global variables if needed
    },
  };
});
