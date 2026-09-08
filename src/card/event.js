import { appendEventContent } from "../event/content.js";
import { generateCard } from "./base.js";

/**
 * イベント詳細のポップアップを表示する。
 * @param {EventInfo} eventInfo
 * @param {((clicked: string) => any)|null} [onCategoryClick]
 */
export function showEventCard(eventInfo, onCategoryClick = null) {
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
      onCategoryClick,
    },
  );
}
