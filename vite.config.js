import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: 'https://vdft9knjc2.execute-api.ap-southeast-2.amazonaws.com',
  //       changeOrigin: true,
  //       rewrite: (path) => path.replace(/^\/api/, '/dev'),
  //     },
  //   },
  // },
})