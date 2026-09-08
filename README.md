# digitalpamphlet-htbs26

高校の文化祭用デジタルパンフレットツール。

## セットアップ
```sh
git clone https://github.com/manmen2414/digitalpamphlet-htbs26
cd digitalpamphlet-htbs26
npm i
```  
インストール完了後、env_devフォルダーを**publicディレクトリ内の**envフォルダーとしてコピーしてください。  
envフォルダー内に部屋情報やブース情報、イベント情報を追加します。  
実際に用いた環境をそのまま掲載すると学校情報の漏洩につながるため、env内はコミットされません。

## 開発用サーバー
```sh
# 通常の開発サーバー
npm run dev
# LAN公開される開発サーバー
npm run dev-host
```

## ビルド
```sh
npm run build
```  
ビルド結果は`dist/`へエクスポートされます。

## デバッグツール
`src/debug.js`の変数`debug`が`true`の際、デバッグモードとして以下の変更が行われます。
- マップ上で、ブースやイベントのない部屋のハイライト
- マップ上で、`env/mapinfo.js`に用いる部屋情報を取得する機能
  - マップの右下をShift左クリック、次に左上をShift左クリックすると位置情報を含んだ`RoomInfo`オブジェクトがクリップボードにコピーされます。

## 制作情報
このプロジェクトの開発にあたって、GeminiやClaude等のAIツールを部分的に活用しています。\
これは 全てをAIツールにコーディングさせている という意ではありません。