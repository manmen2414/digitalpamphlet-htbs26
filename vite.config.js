import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import {
  PWA_NAME,
  PWA_SHORT_NAME,
  PWA_DESCRIPTION,
} from "./public/env/manifest.js";
import viteLegacyPlugin from "@vitejs/plugin-legacy";

// PWA用のもろもろ: PWAを使わない場合はファイルごと消してもOK
export default defineConfig({
  plugins: [
    viteLegacyPlugin({
      targets: ["defaults", "not IE 11"],
    }),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: PWA_NAME,
        short_name: PWA_SHORT_NAME,
        description: PWA_DESCRIPTION,
        theme_color: "#d2e3e4",
        background_color: "#dddddd",
        display: "standalone",

        // ★ アイコンの指定箇所
        icons: [
          {
            src: "/icon192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any", // 通常のアイコン
          },
          {
            src: "/icon512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icon512.png", // または通常の512と同じ画像
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable", // Androidの形（丸型・角丸など）に合わせてトリミングされる用
          },
        ],
      },
      workbox: {
        cleanupOutdatedCaches: true,
        // 新しいSWがインストールされたら即座に有効化して制御を奪う（古いSWの残存を防ぐ）
        skipWaiting: true,
        clientsClaim: true,

        // ① ビルド時に一括保存する静的ファイル
        globPatterns: ["**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp}"],
        // ② 更新頻度が高いJSONだけプリキャッシュから外す
        globIgnores: [
          "**/env/events.json",
          "**/*-legacy.*",
          "**/polyfills-*.*",
        ],

        // SPA用のフォールバック設定
        navigateFallback: "/index.html",
        navigateFallbackDenylist: [
          /^\/env\//, // /env/ から始まるパスを除外
          /\.json$/, // .json で終わるURLを除外
        ],

        runtimeCaching: [
          {
            // 画像（SVG含む）を CacheFirst にする
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
            // ★ 関数ではなく正規表現で指定する（エラー防止）
            urlPattern: /\/env\/events\.json$/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "env-json-cache",
              networkTimeoutSeconds: 5,
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
});
