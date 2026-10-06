import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'node:path'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    VitePWA({
      // Our own service worker (src/sw.ts) so it can also handle push messages.
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.ts',
      registerType: 'autoUpdate',
      injectRegister: false, // registered by src/pwa.ts, which controls when updates are applied
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff,woff2}'],
      },
      manifest: {
        name: 'Fitelle',
        short_name: 'Fitelle',
        description: 'Orders, customers and portfolio for fashion designers.',
        start_url: '/overview',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#faf7f2',
        theme_color: '#a9694a',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
