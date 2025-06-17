import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    // Ensure environment variables are properly exposed
    define: {
      // Explicitly define Supabase environment variables
      // This ensures they are available at runtime
      '__SUPABASE_URL__': JSON.stringify(env.VITE_SUPABASE_URL || ''),
      '__SUPABASE_ANON_KEY__': JSON.stringify(env.VITE_SUPABASE_ANON_KEY || ''),
      '__SUPABASE_SERVICE_ROLE_KEY__': JSON.stringify(env.VITE_SUPABASE_SERVICE_ROLE_KEY || ''),
    },
  };
});
