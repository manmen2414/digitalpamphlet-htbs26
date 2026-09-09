import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        // ① ビルド時に一括保存する静的ファイル（SVGも含めています）
        globPatterns: ["**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp}"],

        // ② 更新頻度が高いJSONだけプリキャッシュから外す
        globIgnores: ["**/env/data.json"],

        runtimeCaching: [
          {
            // env/images と env/map 配下の画像（SVG含む）を CacheFirst（キャッシュ優先）にする
            urlPattern:
              /\/env\/(images|map)\/.*\.(png|jpg|jpeg|svg|webp|gif)$/i,
            handler: "CacheFirst",
            options: {
              cacheName: "env-media-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24, // 1日間
              },
            },
          },
          {
            // env 直下の更新頻度が高いJSON（ネットワーク優先）
            urlPattern: /\/env\/data\.json$/,
            handler: "NetworkFirst",
            options: {
              cacheName: "env-json-cache",
              networkTimeoutSeconds: 5,
            },
          },
        ],
      },
    }),
  ],
});
