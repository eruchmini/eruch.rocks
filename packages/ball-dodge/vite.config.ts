import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/ball-dodge/",
  build: {
    outDir: "../../dist/ball-dodge",
    emptyOutDir: true,
  },
});
