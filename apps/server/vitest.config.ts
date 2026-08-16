import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/__tests__/**/*.test.ts'],
    exclude: ['dist/**', 'node_modules/**'],
    env: {
      DATABASE_URL:
        process.env.DATABASE_URL ||
        'postgresql://neondb_owner:npg_dwtvJCP3U7Ti@ep-late-sun-azh9fdkk.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require',
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
