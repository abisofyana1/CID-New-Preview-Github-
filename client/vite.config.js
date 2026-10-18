import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '../', '');
  const backendHost = env.APP_HOST || '127.0.0.1';
  const backendPort = env.APP_PORT || '8100';

  return {
    base: process.env.BASE_URL || './',
    plugins: [react()],
    envDir: '../',
    server: {
      host: true,
      port: parseInt(env.VITE_PORT) || 5173,
      proxy: {
        '/api': {
          target: `http://${backendHost}:${backendPort}`,
          changeOrigin: true,
          secure: false
        }
      }
    }
  }
})

