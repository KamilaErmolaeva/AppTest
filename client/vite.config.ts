import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
      },
    }),
  ],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:2050",
        changeOrigin: true,
        secure: false,
      },
      "/pay/check": {
        target: "http://localhost:2050",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
