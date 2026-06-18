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
  // デバッグ中はズーム最大を上げる
  maxZoom: debug ? 6 : 3,
  maxBounds: mapBounds, // ★画面がこの範囲の外に出ないように制限
  zoomControl: false, // デフォルトのズームコントロールを無効化
}).fitBounds(mapBounds);

// 拡大/縮小コントロールを右下に配置
L.control
  .zoom({
    position: "bottomright",
  })
  .addTo(map);

map.setView(L.latLng(svgHeight, 0));

// ユーティリティ
/**
 * 現在のマップのズーム量を基準にBoundのサイズを取得する。
 * @param {L.LatLngBounds} bounds
 */
function calcBoundsWidthHeightPixel(bounds) {
  const sw = bounds.getSouthWest();
  const ne = bounds.getNorthEast();
  const swPoint = map.latLngToContainerPoint(sw);
  const nePoint = map.latLngToContainerPoint(ne);
  const width = Math.abs(nePoint.x - swPoint.x);
  const height = Math.abs(nePoint.y - swPoint.y);
  return { width, height };
}

/**
 * 階層ごとの画像が保持される
 * @type {L.ImageOverlay[]}
 */
const imageOverlays = [];

/**
 * 階層ごとの画像が保持される(ラジオボタン用)
 * @type {{[floorName:string]:L.ImageOverlay}}
 */
const baseLayers = {};

/**
 * 階層ごとのコンポーネントが保持される
 * @type {Map<string,L.LayerGroup>}}
 */
const layerGroups = new Map();

/**
 * 部屋名のラベルが保存される (一定ズーム以上の際にlayerGroupに属する)
 * @type {Map<string,L.LayerGroup>}}
 */
const roomLabelLayerGroups = new Map();

/**
 * 部屋名のラベルと部屋のバウンドの紐づけ
 * @type {Map<L.Marker,L.LatLngBounds>}}
 */
const roomLabelBounds = new Map();

// 階ごとにマップコンポーネントを処理する
for (const floor of mapInfo.floors) {
  const imgOverlay = L.imageOverlay(`/env/${floor.floorFile}`, mapBounds, {
    attribution: mapInfo.attribution,
  });
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
      // デバッグ時は部屋情報を全て表示する
      debug,
      "#a3a300",
    );
    // 部屋の四角形を生成する場合
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

    // テキストの生成 (ズームするまで表示されないので本処理はズーム時に任せる)
    const textIcon = L.divIcon({
      className: "map-room-text",
      html: room.name,
    });
    const marker = L.marker(bounds.getCenter(), { icon: textIcon });
    marker.addTo(roomLabelLayerGroup);
    roomLabelBounds.set(marker, bounds);
  }

  layerGroups.set(floor.floorName, layerGroup);
  roomLabelLayerGroups.set(floor.floorName, roomLabelLayerGroup);
}

let nowBaseLayerName = "";
/**
 * マップ画像切り替え時に表示するコンポーネントを切り替える
 * @param {string} newBaseLayerName マップの名前(1階, 2階, ...)
 */
function changeLayerGroups(newBaseLayerName) {
  layerGroups.get(nowBaseLayerName)?.remove();
  layerGroups.get(newBaseLayerName)?.addTo(map);
  nowBaseLayerName = newBaseLayerName;
}

/**
 * ズーム量を確認しラベルの表示非表示を切り替える
 */
function recheckRoomLabelShowStatus() {
  const currentZoom = map.getZoom();
  //TODO: 取得処理共通化(そもそもキャッシュする？)
  const layerGroup = layerGroups.get(nowBaseLayerName);
  const roomLabelLayerGroup = roomLabelLayerGroups.get(nowBaseLayerName);
  if (!layerGroup || !roomLabelLayerGroup) {
    throw new Error(
      `recheckRoomLabelShowStatus: layer group not found (floorName: ${nowBaseLayerName})`,
    );
  }
  if (currentZoom < zoomThreshold) roomLabelLayerGroup.remove();
  else roomLabelLayerGroup.addTo(layerGroup);
}

/**
 * ズームサイズに応じたラベルの要素サイズを変更
 */
function calculateRoolLabelArea() {
  const roomLabelLayerGroup = roomLabelLayerGroups.get(nowBaseLayerName);
  if (!roomLabelLayerGroup) {
    throw new Error(
      `Map zoomend: layer group not found (floorName: ${nowBaseLayerName})`,
    );
  }
  roomLabelLayerGroup.eachLayer((label) => {
    if (!(label instanceof L.Marker)) return;
    const bounds = roomLabelBounds.get(label);
    const icon = label.getIcon();
    if (!(icon instanceof L.DivIcon))
      throw new Error(`Map zoomend: Other than DivIcon was found`);
    const optionsHtml = icon.options.html;
    const html =
      optionsHtml instanceof HTMLElement
        ? optionsHtml.innerHTML
        : optionsHtml || undefined;
    if (!bounds) throw new Error(`Map zoomend: unknown bounds (${html})`);
    const { width, height } = calcBoundsWidthHeightPixel(bounds);

    // 新しいサイズとアンカーを反映したアイコンを再生成
    const updatedIcon = L.divIcon({
      className: "map-room-text", // CSSクラス名を指定
      html,
      iconSize: [width, height], // アイコンのサイズ [幅, 高さ]
      iconAnchor: [width / 2, height / 2], // 位置の基準点（中心に合わせる）
    });

    // 既存のマーカーに新しいアイコンをセット（これでサイズが変わる）
    label.setIcon(updatedIcon);
  });
}

/**@type {[number,number]|null} */
let __debug_bounds = null;
/**@type {L.Popup|null} */
let __debug_popup = null;
map.on("click", function (e) {
  // デバッグのコピー挙動
  if (debug && e.originalEvent.shiftKey) {
    if (!__debug_bounds && !__debug_popup) {
      const coord = e.latlng;
      __debug_bounds = [coord.lat, coord.lng];

      __debug_popup = L.popup({
        closeButton: false /* 閉じるボタン[x]を非表示にする */,
        autoClose: false /* 他の場所をクリックしても勝手に閉じないようにする */,
        closeOnClick: false /* マップをクリックしても勝手に閉じないようにする */,
        className: "fade-popup" /* アニメーション用のCSSクラス（任意） */,
      })
        .setLatLng(coord)
        .setContent(`右下`)
        .openOn(map);
    } else if (!!__debug_bounds) {
      const coord = e.latlng;
      const lastBounds = [coord.lat, coord.lng];
      navigator.clipboard.writeText(`
        {
          name: "",
          bounds: [
            [${__debug_bounds}],
            [${lastBounds}],
          ],
        },`);
      const lastPopup = L.popup({
        closeButton: false /* 閉じるボタン[x]を非表示にする */,
        autoClose: false /* 他の場所をクリックしても勝手に閉じないようにする */,
        closeOnClick: false /* マップをクリックしても勝手に閉じないようにする */,
        className: "fade-popup" /* アニメーション用のCSSクラス（任意） */,
      })
        .setLatLng(coord)
        .setContent(`左上`)
        .openOn(map);
      setTimeout(function () {
        map.closePopup(lastPopup); // ポップアップを閉じる
        if (!!__debug_popup) map.closePopup(__debug_popup);
        __debug_bounds = null;
        __debug_popup = null;
      }, 500);
    }
  }
});

map.on("baselayerchange", function (e) {
  changeLayerGroups(e.name);
  recheckRoomLabelShowStatus();
  calculateRoolLabelArea();
});

map.on("zoomend", function () {
  recheckRoomLabelShowStatus();
  calculateRoolLabelArea();
});

// 右上コントロールの表示
L.control
  .layers(baseLayers, undefined, {
    position: "topright",
    collapsed: false, // falseにすると、最初からメニューが開いた状態になります
  })
  .addTo(map);

// 1階を表示
baseLayers["1階"].addTo(map);
changeLayerGroups("1階");
