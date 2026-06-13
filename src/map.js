import L from "leaflet";
import "leaflet/dist/leaflet.css";
import mapInfo from "../env/mapinfo.js";
import { multiSelect } from "./util.js";
import { debug } from "./debug.js";

// マップの基本設定
const svgWidth = 700;
const svgHeight = 800;
const mapBounds = L.latLngBounds(L.latLng(0, 0), L.latLng(svgHeight, svgWidth));
const zoomThreshold = 1;

const roomColorBooth = "#3388ff";
const roomColorHasEvent = "#aaff33";
const roomColorToilet = "#a0fff7";

// マップ初期化（最初はレイヤーを入れずに土台だけ作る）
const map = L.map("map", {
  crs: L.CRS.Simple,
  minZoom: 0,
  maxZoom: debug ? 6 : 3,
  maxBounds: mapBounds, // ★画面がこの範囲の外に出ないように制限
}).fitBounds(mapBounds);

map.setView(L.latLng(svgHeight, 0));

/**@type {L.ImageOverlay[]} */
const imageOverlays = [];
/**@type {{[floorName:string]:L.ImageOverlay}} */
const baseLayers = {};
/**@type {{[floorName:string]:L.LayerGroup}} */
const layerGroups = {};
/**@type {{[floorName:string]:L.LayerGroup}} */
const roomLabelLayerGroups = {};

for (const floor of mapInfo.floors) {
  const imgOverlay = L.imageOverlay(`/env/${floor.floorFile}`, mapBounds);
  imageOverlays.push(imgOverlay);

  baseLayers[floor.floorName] = imgOverlay;
  const layerGroup = L.layerGroup();
  const roomLabelLayerGroup = L.layerGroup();

  // 部屋の生成
  for (const room of floor.rooms) {
    const bounds = L.latLngBounds(
      L.latLng(...room.bounds[0]),
      L.latLng(...room.bounds[1]),
    );

    // 四角形の生成
    /**@type {string|undefined} */
    const color = multiSelect(
      room.eventId,
      roomColorHasEvent,
      room.boothId,
      roomColorBooth,
      room.name === "トイレ",
      roomColorToilet,
      debug,
      "#a3a300",
    );
    if (typeof color !== "undefined") {
      /**@type {L.PolylineOptions} */
      const defaultStyle = {
        className: "map-room-selectable",
        color: color, // 枠線の色
        weight: 3, // 枠線の太さ
        fillColor: color, // 塗りつぶしの色
        fillOpacity: 0.2, // 塗りつぶしの透過度
      };
      const rectangle = L.rectangle(bounds, defaultStyle);
      rectangle.addTo(layerGroup);
    }

    // テキストの生成

    const width = Math.abs(room.bounds[0][1] - room.bounds[1][1]) * 4;
    const height = Math.abs(room.bounds[0][0] - room.bounds[1][0]) * 4;

    const textIcon = L.divIcon({
      className: "map-room-text", // CSSクラス名を指定
      html: room.name,
      iconSize: [width, height], // アイコンのサイズ [幅, 高さ]
      iconAnchor: [width / 2, height / 2], // 位置の基準点（中心に合わせる）
    });
    const marker = L.marker(bounds.getCenter(), { icon: textIcon });
    marker.addTo(roomLabelLayerGroup);
  }

  layerGroups[floor.floorName] = layerGroup;
  roomLabelLayerGroups[floor.floorName] = roomLabelLayerGroup;
}

let nowBaseLayerName = "";
/**
 * @param {string} newBaseLayerName
 */
function changeLayerGroups(newBaseLayerName) {
  console.log(newBaseLayerName);
  layerGroups[nowBaseLayerName]?.remove();
  layerGroups[newBaseLayerName]?.addTo(map);
  nowBaseLayerName = newBaseLayerName;
}
map.on("baselayerchange", function (e) {
  changeLayerGroups(e.name);
});

map.on("zoomend", function () {
  const currentZoom = map.getZoom();
  Object.keys(layerGroups).forEach((floorName) => {
    const layerGroup = layerGroups[floorName],
      roomLabelLayerGroup = roomLabelLayerGroups[floorName];
    if (currentZoom < zoomThreshold) roomLabelLayerGroup.remove();
    else roomLabelLayerGroup.addTo(layerGroup);
  });
});

L.control
  .layers(baseLayers, undefined, {
    position: "topright",
    collapsed: false, // falseにすると、最初からメニューが開いた状態になります
  })
  .addTo(map);

baseLayers["1階"].addTo(map);
changeLayerGroups("1階");

map.on("click", function (e) {
  if (debug && e.originalEvent.shiftKey) {
    const coord = e.latlng;
    const text = `[${coord.lat},${coord.lng}],`;
    navigator.clipboard.writeText(text);

    const tempPopup = L.popup({
      closeButton: false /* 閉じるボタン[x]を非表示にする */,
      autoClose: false /* 他の場所をクリックしても勝手に閉じないようにする */,
      closeOnClick: false /* マップをクリックしても勝手に閉じないようにする */,
      className: "fade-popup" /* アニメーション用のCSSクラス（任意） */,
    })
      .setLatLng(coord)
      .setContent(`コピーしました: "${text}"`)
      .openOn(map);

    // 2. 2秒後（2000ミリ秒後）に自動的に消すタイマーを設定
    setTimeout(function () {
      map.closePopup(tempPopup); // ポップアップを閉じる
    }, 1000);
  }
});
