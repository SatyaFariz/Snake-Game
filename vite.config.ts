import { defineConfig, loadEnv } from 'vite'
import solid from 'vite-plugin-solid'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [solid()],
    build: {
      target: 'esnext',
      polyfillDynamicImport: false,
    },
    base: '/Snake-Game/',
    mode: env.NODE_ENV,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    }
  }
})
