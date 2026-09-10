import { showBoothCard } from "../card/booth.js";
import { showEventCard } from "../card/event.js";
import { goMap } from "../map/gomap.js";
import { eventDataStore, getEventData } from "./eventData.js";
import { generateEventState, generateEventTableRow } from "./eventState.js";
import { generateEventCard } from "./eventcard.js";

function filterEvents() {
  /**@type {HTMLInputElement | null} */
  const categorySelect = document.querySelector("#event-category-select");
  if (!categorySelect) throw new Error("category select input not found");
  return eventDataStore.events.filter(
    (v) => categorySelect.value === "" || v.category === categorySelect.value,
  );
}

function initFilter() {
  /**@type {HTMLInputElement | null} */
  const categorySelect = document.querySelector("#event-category-select");
  if (!categorySelect) throw new Error("category select input not found");
  /**@type {Set<string>} */
  const categories = new Set();
  eventDataStore.events.forEach((v) => {
    categories.add(v.category);
  });
  categories.forEach((v) => {
    const option = document.createElement("option");
    option.value = v;
    option.innerText = v;
    categorySelect.append(option);
  });

  categorySelect.onchange = () => {
    updateEvent(filterEvents());
  };
}

/**
 * @param {EventInfo[]} events
 */
function updateEvent(events) {
  const cards = events.map((e) => {
    const state = generateEventState(e.times);
    const base = generateEventCard(
      e.title,
      e.operator,
      e.eventImage,
      e.times,
      state,
    );
    base.onclick = () => {
      showEventCard(e, () => goMap(e.eventId, "event"));
    };
    return { ...e, base, state };
  });

  const eventList = document.querySelector("#event-list");
  if (!eventList) throw new Error("event list element not found");
  const eventTable = document.querySelector("table.event-times > tbody");
  if (!eventTable) throw new Error("event table element not found");

  eventList.innerHTML = "";
  eventTable.innerHTML = "";
  cards.forEach(({ base }) => {
    eventList.append(base);
  });
  cards
    .sort(({ state: a }, { state: b }) => {
      if (a.type === "inheld") return b.type === "inheld" ? 0 : -1;
      if (b.type === "inheld") return 1;
      if (a.type === "end") return b.type === "end" ? 0 : 1;
      if (b.type === "end") return -1;
      return a.leftMin - b.leftMin;
    })
    .forEach(({ title, operator, state }) => {
      eventTable.append(generateEventTableRow(title, state, operator));
    });
}

function regularUpdate() {
  setInterval(() => {
    const now = new Date();
    const seconds = now.getSeconds();
    if (seconds === 0) {
      updateEvent(filterEvents());
    }
  }, 500);
}

async function onRefreshButton() {
  /**@type {HTMLSpanElement|null} */
  const label = document.querySelector("#reload-event-btn-label");
  if (label) label.innerText = "更新中";
  const result = await getEventData().then(
    () => true,
    () => false,
  );
  if (result && label) label.innerText = "完了";
  if (!result && label) label.innerText = "失敗";

  updateEvent(filterEvents());

  setTimeout(() => {
    if (label) label.innerText = "更新";
  }, 2000);
}

export async function initEvent() {
  await getEventData();
  initFilter();
  updateEvent(filterEvents());
  regularUpdate();

  document
    .querySelector("#reload-event-btn")
    ?.addEventListener("click", onRefreshButton);
}
