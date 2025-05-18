import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"], // 👈 Ensure ESM format
  target: "node20",
  outDir: "dist",
  splitting: false,
  clean: true,
  shims: false,
  bundle: false,
});
