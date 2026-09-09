import L from "leaflet";
import mapInfo from "../../public/env/mapinfo.js";
import { getBoothsByIds } from "../booth/data.js";
import { showBoothCard } from "../card/booth.js";
import { addSelectionsToCard } from "../card/selections.js";
import { generateCard } from "../card/base.js";
import { debug } from "../debug.js";
import { mapState, requireMap } from "./state.js";
import { showEventCard } from "../card/event.js";
import { getEventsByIds } from "../event/data.js";

/** @type {[number, number]|null} */
let debugBounds = null;
/** @type {L.Popup|null} */
let debugPopup = null;

/** @type {((category: string) => void)|null} */
let onBoothCategoryClick = null;

/**
 * @param {L.LeafletMouseEvent} e
 */
function handleDebugBoundsClick(e) {
  const map = requireMap();
  if (!debugBounds && !debugPopup) {
    const coord = e.latlng;
    debugBounds = [coord.lat, coord.lng];
    debugPopup = L.popup({
      closeButton: false,
      autoClose: false,
      closeOnClick: false,
      className: "fade-popup",
    })
      .setLatLng(coord)
      .setContent("右下")
      .openOn(map);
    return;
  }

  if (!debugBounds) return;

  const coord = e.latlng;
  const lastBounds = [coord.lat, coord.lng];
  navigator.clipboard.writeText(`
        {
          name: "",
          bounds: [
            [${debugBounds}],
            [${lastBounds}],
          ],
        },`);
  const lastPopup = L.popup({
    closeButton: false,
    autoClose: false,
    closeOnClick: false,
    className: "fade-popup",
  })
    .setLatLng(coord)
    .setContent("左上")
    .openOn(map);
  setTimeout(function () {
    map.closePopup(lastPopup);
    if (debugPopup) map.closePopup(debugPopup);
    debugBounds = null;
    debugPopup = null;
  }, 500);
}

/**
 * @param {L.LatLng} latlng
 * @returns {RoomInfo|undefined}
 */
function findRoomAt(latlng) {
  const floor = mapInfo.floors.find(
    (f) => f.floorName === mapState.nowBaseLayerName,
  );
  if (!floor) return;
  return floor.rooms.find(
    (r) =>
      r.bounds[0][0] < latlng.lat &&
      r.bounds[0][1] > latlng.lng &&
      r.bounds[1][0] > latlng.lat &&
      r.bounds[1][1] < latlng.lng,
  );
}

/**
 * @param {RoomInfo} room
 */
function openRoomBooths(room) {
  if (!room.boothIds || room.boothIds.length === 0) return;
  const booths = getBoothsByIds(room.boothIds);
  if (booths.length === 1) {
    showBoothCard(booths[0], onBoothCategoryClick);
    return;
  }
  if (booths.length > 1) {
    addSelectionsToCard(
      generateCard("selections").card,
      booths.map((b) => [
        b.operator,
        () => showBoothCard(b, onBoothCategoryClick),
      ]),
      room.name,
    );
  }
}
/**
 * @param {RoomInfo} room
 */
function openRoomEvents(room) {
  if (!room.eventIds || room.eventIds.length === 0) return;
  const events = getEventsByIds(room.eventIds);
  console.log(events);
  if (events.length === 1) {
    showEventCard(events[0]);
    return;
  }
  if (events.length > 1) {
    addSelectionsToCard(
      generateCard("selections").card,
      events.map((b) => [b.operator, () => showEventCard(b)]),
      room.name,
    );
  }
}

/**
 * @param {L.Map} map
 * @param {((category: string) => void)|null} [categoryClick]
 */
export function bindMapClicks(map, categoryClick = null) {
  onBoothCategoryClick = categoryClick;
  map.on("click", function (e) {
    if (debug && e.originalEvent.shiftKey) {
      handleDebugBoundsClick(e);
      return;
    }

    const room = findRoomAt(e.latlng);
    if (!room) return;
    if (room.boothIds) openRoomBooths(room);
    if (room.eventIds) openRoomEvents(room);
  });
}
