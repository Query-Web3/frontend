import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    proxy: {
      // "/api/v1": "http://localhost:8000",
      "/api/v1": "http://apiqueryweb3.wmjtyd.net",
    },
  },
});
