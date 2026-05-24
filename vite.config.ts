import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: {
          '/api': {
            target: 'http://localhost:3001',
            changeOrigin: true,
            onError: (err, req, res) => {
              console.error('[Vite Proxy Error]', err.message);
              res.writeHead(503, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ 
                error: 'Backend API server is not running. Run `npm run dev` which starts both frontend and backend.' 
              }));
            },
            onProxyReq: (proxyReq, req, res) => {
              if (req.body) {
                proxyReq.write(JSON.stringify(req.body));
              }
            }
          }
        }
      },
      plugins: [react()],
      define: {
        // 'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
