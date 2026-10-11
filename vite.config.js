import { fileURLToPath, URL } from "node:url";
import { copyFileSync } from "node:fs";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";

export default defineConfig({
  plugins: [
    vue(),
    vuetify({ autoImport: true }),
    {
      name: "iis-history-config",
      apply: "build",
      writeBundle() {
        copyFileSync("web.config", "dist/web.config");
      },
    },
  ],
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  server: { host: "127.0.0.1", port: 8080, strictPort: true },
  preview: { host: "127.0.0.1", port: 4173, strictPort: true },
});
