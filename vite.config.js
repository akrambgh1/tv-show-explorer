import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// `base` matches the GitHub Pages URL: https://akrambgh1.github.io/tv-show-explorer/
export default defineConfig({
  plugins: [react()],
  base: "/tv-show-explorer/",
});
