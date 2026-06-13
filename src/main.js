import L from "leaflet";
import "leaflet/dist/leaflet.css";

const map = L.map("map", {
  crs: L.CRS.Simple,
  minZoom: -1,
  maxZoom: 2,
});

// 2. SVGのサイズに合わせて表示範囲（Bounds）を設定
// 例として SVGの横幅が 800px、縦幅が 600px の場合
const w = 800;
const h = 600;
// Leafletの座標は [y, x] (縦, 横) の順になる点に注意
const bounds = [
  [0, 0],
  [h, w],
];

// 3. L.SVGOverlay の作成とマップへの追加
const svgUrl = "/public/map.svg"; // 用意したSVGファイルのパス
const svgOverlay = L.svgOverlay(svgUrl, bounds, {
  interactive: true, // SVG内の要素とのインタラクション（クリック等）を有効にする
}).addTo(map);

// 初期表示時にマップ全体が収まるようにズーム位置を調整
map.fitBounds(bounds);
