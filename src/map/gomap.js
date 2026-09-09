import { closeCard } from "../card";
import { pageState } from "../pageState";
import mapInfo from "../../public/env/mapinfo";
import L from "leaflet";
import {
  changeLayerGroups,
  refreshCurrentFloorDisplay,
  showFloor,
} from "./update";
import { mapState, requireMap } from "./state";

/**
 * マップへ向かう。
 * @param {string} id
 * @param {"booth"|"event"} type
 */
export function goMap(id, type) {
  const map = requireMap();
  closeCard();
  pageState.page = "map";

  for (const floor of mapInfo.floors) {
    const room = floor.rooms.find((r) => {
      if (type === "booth" && r.boothIds && r.boothIds.includes(id))
        return true;
      if (type === "event" && r.eventIds && r.eventIds.includes(id))
        return true;
      return false;
    });
    if (!room) continue;
    const bounds = L.latLngBounds(
      L.latLng(...room.bounds[0]),
      L.latLng(...room.bounds[1]),
    );
    if (mapState.nowBaseLayerName !== floor.floorName) {
      map.removeLayer(mapState.baseLayers[mapState.nowBaseLayerName]);
      map.addLayer(mapState.baseLayers[floor.floorName]);
    }
    map.setZoom(2);
    setTimeout(() => {
      map.panTo(bounds.getCenter());
    }, 300);
  }
}
