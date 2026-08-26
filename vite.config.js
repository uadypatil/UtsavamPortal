import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      registerType: "autoUpdate",

      includeAssets: [
        'utsavamLogoCircle.png',
      ],

      manifest: {
        name: "Utsavam",
        short_name: "Utsavam",
        description: "Where Tradition Meets Technology",

        start_url: "/",
        scope: "/",
        display: "standalone",

        theme_color: '#4F46E5',
        background_color: "#ffffff",

        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },

      workbox: {
        cleanupOutdatedCaches: true,
      },
    }),
  ],

  server: {
    host: true,
    port: 5100,
  },
});
