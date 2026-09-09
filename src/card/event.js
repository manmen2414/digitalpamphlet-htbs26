import { appendEventContent } from "../event/content.js";
import { generateCard } from "./base.js";

/**
 * イベント詳細のポップアップを表示する。
 * @param {EventInfo} eventInfo
 */
export function showEventCard(eventInfo) {
  const { card } = generateCard("event");
  appendEventContent(
    card,
    {
      title: eventInfo.title,
      operator: eventInfo.operator,
      eventImage: eventInfo.eventImage,
      category: eventInfo.category,
      description: eventInfo.description,
      times: eventInfo.times,
    },
    {
      prefix: "card",
      showDescription: true,
      categoryTag: "button",
    },
  );
}
