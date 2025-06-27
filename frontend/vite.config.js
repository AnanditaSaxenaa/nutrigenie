import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { mtConfig } from "@material-tailwind/react";
import path from 'path';

export default defineConfig({
  base: '/',
  plugins: [
    tailwindcss(),
    react(),
    mtConfig
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
    proxy: {
      '/api': 'https://your-backend-domain.com',
    }
  }
});
