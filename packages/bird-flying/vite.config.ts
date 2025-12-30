import { defineConfig } from "vite";

export default defineConfig({
  base: "/bird-flying/",
  build: {
    outDir: "../../dist/bird-flying",
    emptyOutDir: true,
  },
});
