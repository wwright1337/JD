import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icon-192.png", "icon-512.png"],
      manifest: {
        id: "/",
        name: "Just Drink",
        short_name: "Just Drink",
        description: "A designated driver comes to you and drives your own car home.",
        theme_color: "#12141C",
        background_color: "#12141C",
        display: "standalone",
        orientation: "portrait",
        categories: ["travel", "utilities"],
        start_url: "/",
        icons: [
          { src: "icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" }
        ]
      }
    })
  ]
});
