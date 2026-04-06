import path from 'node:path';
import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.[jt]sx?$/,
    exclude: []
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx'
      }
    }
  },
  resolve: {
    alias: [
      {
        find: '@root',
        replacement: path.resolve(__dirname, 'src')
      },
      {
        find: '@core',
        replacement: path.resolve(__dirname, 'src/core')
      },
      {
        find: /^@pages$/,
        replacement: path.resolve(__dirname, 'src/pages/index.js')
      },
      {
        find: '@pages/',
        replacement: `${path.resolve(__dirname, 'src/pages')}/`
      }
    ]
  },
  server: {
    host: true,
    port: 3000,
    strictPort: true
  }
});
