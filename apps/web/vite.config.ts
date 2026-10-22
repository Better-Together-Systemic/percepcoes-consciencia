import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Em desenvolvimento a API roda separada; o proxy mantém tudo na mesma origem
    // para que o cookie de sessão SameSite=Strict funcione.
    proxy: {
      '/api': { target: 'http://127.0.0.1:3333', changeOrigin: false },
    },
  },
  build: {
    sourcemap: false,
  },
});
