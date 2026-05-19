import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'node',
  },
  resolve: {
    alias: {
      '@util': resolve(__dirname, 'util'),
      '@': resolve(__dirname, 'src'),
    },
  },
});
