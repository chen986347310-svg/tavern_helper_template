import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
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
