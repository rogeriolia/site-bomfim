import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ command, mode }) => {
  const base = command === 'build' || mode === 'production' ? '/site-bomfim/' : '/'
  return {
    base,
    ...(command === 'serve' ? { server: { proxy: { '/api': { target: 'http://127.0.0.1:5183', changeOrigin: false } } } } : {}),
    plugins: [
      {
        name: 'bomfim-public-assets-in-subdirectory',
        enforce: 'pre',
        transform(code, id) {
          if (command !== 'build' || !id.includes('/src/') || !/\.(jsx?|json)$/.test(id)) return null
          return code.includes('/assets/') ? code.replaceAll('/assets/', `${base}assets/`) : null
        },
      },
      react(),
      tailwindcss(),
    ],
  }
})
