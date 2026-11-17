import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        booking: resolve(__dirname, 'booking.html'),
        pricing: resolve(__dirname, 'pricing.html'),
        tracking: resolve(__dirname, 'tracking.html'),
        services: resolve(__dirname, 'services.html'),
      },
    },
  },
});
