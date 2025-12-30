import { defineConfig } from 'vite'

export default defineConfig({
  base: '/clicker/',
  build: {
    outDir: '../../dist/clicker',
    emptyOutDir: true,
  },
})
