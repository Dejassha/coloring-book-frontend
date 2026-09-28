import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load .env values (including plain PORT, not just VITE_-prefixed ones)
  const env = loadEnv(mode, process.cwd(), '');
  const port = Number(env.PORT) || 3000;

  return {
    plugins: [react()],
    server: {
      port,
      strictPort: true, // fail loudly instead of silently picking another port
    },
    preview: {
      port,
      strictPort: true,
    },
  };
});
