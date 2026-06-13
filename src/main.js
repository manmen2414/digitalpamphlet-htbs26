import L from "leaflet";
import "./style.css";
import "leaflet/dist/leaflet.css";

// マップの基本設定
const svgWidth = 600;
const svgHeight = 800;
const bounds = L.latLngBounds(L.latLng(0, 0), L.latLng(svgHeight, svgWidth));

// マップ初期化（最初はレイヤーを入れずに土台だけ作る）
const map = L.map("map", {
  crs: L.CRS.Simple,
  minZoom: 0,
  maxZoom: 3,
  maxBounds: bounds, // ★画面がこの範囲の外に出ないように制限
}).fitBounds(bounds);

map.setView(L.latLng(svgHeight, 0));

// ==========================================
// 1. ベースレイヤー（背景画像）の定義
// ==========================================
const floor1 = L.imageOverlay("/env/floor1.svg", bounds);
const floor2 = L.imageOverlay("/env/floor2.svg", bounds);
const floor3 = L.imageOverlay("/env/floor3.svg", bounds);

// 最初に表示しておきたい階層だけマップに追加する
floor1.addTo(map);

// ==========================================
// 2. オーバーレイ（重ねる要素）の定義
// ==========================================
// 1階用のピン
const shopA = L.marker([400, 300]).bindPopup("1階のショップA");
const shopB = L.marker([500, 300]).bindPopup("1階のショップB");
const shops1F = L.layerGroup([shopA, shopB]); // 複数のピンをグループ化

// 2階用のピン
const shopC = L.marker([300, 500]).bindPopup("2階のショップC");
const shops2F = L.layerGroup([shopC]);

// 3階用のピン
const shopD = L.marker([300, 500]).bindPopup("3階のショップD");
const shops3F = L.layerGroup([shopD]);

// 最初に1階のピンだけマップに追加しておく
shops1F.addTo(map);

// ==========================================
// 3. レイヤーコントロール（切り替えスイッチ）の作成
// ==========================================

// ラジオボタンになるリスト（1つだけ選択可能）
const baseMaps = {
  "1階フロア": floor1,
  "2階フロア": floor2,
  "3階フロア": floor3,
};

// 階層が切り替わった時のイベント
map.on("baselayerchange", function (e) {
  if (e.name === "1階フロア") {
    map.addLayer(shops1F); // 1階のピンを表示
    map.removeLayer(shops2F); // 2階のピンを非表示
    map.removeLayer(shops3F); // 3階のピンを非表示
  } else if (e.name === "2階フロア") {
    map.addLayer(shops2F); // 2階のピンを表示
    map.removeLayer(shops1F); // 1階のピンを非表示
    map.removeLayer(shops3F); // 3階のピンを非表示
  } else if (e.name === "3階フロア") {
    map.addLayer(shops3F); // 2階のピンを表示
    map.removeLayer(shops1F); // 1階のピンを非表示
    map.removeLayer(shops2F); // 2階のピンを非表示
  }
});

// コントロールをマップの右上（topright）に追加
L.control
  .layers(baseMaps, undefined, {
    position: "topright",
    collapsed: false, // falseにすると、最初からメニューが開いた状態になります
  })
  .addTo(map);
