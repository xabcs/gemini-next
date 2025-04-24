import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/front/',
  build: {
    minify: 'esbuild',
  },
  server: {
    proxy: {
      '/register': {
        target: 'http://127.0.0.1:8085',
      },
      '/_next': {
        target: 'http://127.0.0.1:8085',
      },
      '/chatbot': {
        target: 'http://127.0.0.1:8085',
      },
      '/fetch': {
        target: 'http://127.0.0.1:8085',
      },
      '/lang': {
        target: 'http://127.0.0.1:8085',
      },
      '/login': {
        target: 'http://127.0.0.1:8085/api/v1',
      },
      '/api': {
        target: 'http://127.0.0.1:8085',
      },
      '/ldap': {
        target: 'http://127.0.0.1:8085',
      },
      '/downlaod/*': {
        target: 'http://127.0.0.1:8085',
      },
      '/oidc/state': {
        target: 'http://127.0.0.1:8085',
      },
    },
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/'),
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
});
