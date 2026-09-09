/**
 * @type {{events:EventInfo[]}}
 */
export const eventDataStore = {
  events: [],
};

/**
 * イベントデータを取得する。
 * @returns {Promise<EventInfo[]>}
 */
export async function getEventData() {
  const res = await fetch("/env/events.json", { cache: "no-store" });
  if (!res.ok) throw new Error(`取得が失敗しました。コード:${res.status}`);
  const data = await res.json().catch();
  eventDataStore.events = data.events;
  return data.events;
}
