import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  server: {
    port: 5173,
    allowedHosts: ['.monkeycode-ai.live']
  }
})
