import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const root = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@': root,
      // Next.js ships `server-only` inside its own bundle, so tests point it at Next's empty module.
      'server-only': `${root}node_modules/next/dist/compiled/server-only/empty.js`,
    },
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    env: {
      AUTH_SECRET: 'test-secret-with-at-least-32-characters',
      AUTH_GITHUB_ID: 'Iv1.testclientid',
      AUTH_GITHUB_SECRET: 'test-client-secret',
    },
    server: { deps: { inline: ['next-auth'] } },
  },
});
