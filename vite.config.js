import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    VitePWA({
  registerType: "autoUpdate",
  manifest: {
    name: "Darul Quran",
    short_name: "Darul Quran",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0d6efd",
    prefer_related_applications: false,

    icons: [
      {
        src: "/icons/darul-quran-logo.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "/icons/darul-quran-logo.png",
        sizes: "512x512",
        type: "image/png"
      }
    ],

    screenshots: [
      {
        src: "/images/download-1.png",
        sizes: "1080x1920",
        type: "image/png",
        form_factor: "narrow"
      },
      {
        src: "/images/download-2.png",
        sizes: "1080x1920",
        type: "image/png",
        form_factor: "narrow"
      },
      {
        src: "/images/download-3.png",
        sizes: "1080x1920",
        type: "image/png",
        form_factor: "narrow"
      },
      {
        src: "/images/download-4.png",
        sizes: "1080x1920",
        type: "image/png",
        form_factor: "narrow"
      },
      {
        src: "/images/download-5.png",
        sizes: "1080x1920",
        type: "image/png",
        form_factor: "narrow"
      },
      {
        src: "/images/download-6.png",
        sizes: "1080x1920",
        type: "image/png",
        form_factor: "narrow"
      }
    ]
  }
})
  ],
  server: {
    host: true,
  },
});
