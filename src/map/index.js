import mapInfo from "../../env/mapinfo.js";
import { bindMapClicks } from "./click.js";
import { buildMapDisplay } from "./display.js";
import { addFloorControl, createMap } from "./init.js";
import { bindMapDisplayUpdates, showFloor } from "./update.js";

/**
 * マップの初期化・表示構築・更新・クリック処理をまとめて起動する。
 * @param {{ onBoothCategoryClick?: ((category: string) => void)|null }} [options]
 */
export function initMap(options = {}) {
  const map = createMap();
  buildMapDisplay();
  bindMapDisplayUpdates(map);
  bindMapClicks(map, options.onBoothCategoryClick ?? null);
  addFloorControl(map);

  const initialFloor = mapInfo.floors[0]?.floorName;
  if (!initialFloor) {
    throw new Error("initMap: mapinfo has no floors");
  }
  showFloor(initialFloor);
}
