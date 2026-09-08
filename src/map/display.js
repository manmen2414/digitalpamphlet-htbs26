import L from "leaflet";
import mapInfo from "../../env/mapinfo.js";
import { debug } from "../debug.js";
import { multiSelect } from "../util.js";
import {
  ROOM_COLOR_BOOTH,
  ROOM_COLOR_DEBUG,
  ROOM_COLOR_HAS_EVENT,
  ROOM_COLOR_TOILET,
  mapBounds,
} from "./constants.js";
import { mapState } from "./state.js";

/**
 * 階層画像・部屋の矩形・部屋名ラベルを生成して state に載せる。
 */
export function buildMapDisplay() {
  for (const floor of mapInfo.floors) {
    const imgOverlay = L.imageOverlay(`/env/${floor.floorFile}`, mapBounds, {
      attribution: mapInfo.attribution,
    });
    mapState.imageOverlays.push(imgOverlay);
    mapState.baseLayers[floor.floorName] = imgOverlay;

    const layerGroup = L.layerGroup();
    const roomLabelLayerGroup = L.layerGroup();

    for (const room of floor.rooms) {
      const bounds = L.latLngBounds(
        L.latLng(...room.bounds[0]),
        L.latLng(...room.bounds[1]),
      );

      /** @type {string|undefined} */
      const color = multiSelect(
        room.eventIds,
        ROOM_COLOR_HAS_EVENT,
        room.boothIds,
        ROOM_COLOR_BOOTH,
        room.name === "トイレ",
        ROOM_COLOR_TOILET,
        debug,
        ROOM_COLOR_DEBUG,
      );

      if (typeof color !== "undefined") {
        /** @type {L.PolylineOptions} */
        const defaultStyle = {
          className: "map-room-selectable",
          color,
          weight: 3,
          fillColor: color,
          fillOpacity: 0.2,
        };
        L.rectangle(bounds, defaultStyle).addTo(layerGroup);
      }

      const textIcon = L.divIcon({
        className: "map-room-text",
        html: room.name,
      });
      const marker = L.marker(bounds.getCenter(), { icon: textIcon });
      marker.addTo(roomLabelLayerGroup);
      mapState.roomLabelBounds.set(marker, bounds);
    }

    mapState.layerGroups.set(floor.floorName, layerGroup);
    mapState.roomLabelLayerGroups.set(floor.floorName, roomLabelLayerGroup);
  }
}
