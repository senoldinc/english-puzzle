import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages proje sitesi /english-puzzle/ altında yayınlanır
export default defineConfig({
  base: '/english-puzzle/',
  plugins: [react()],
});
