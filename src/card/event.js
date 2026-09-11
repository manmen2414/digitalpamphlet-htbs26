import { appendEventContent } from "../event/content.js";
import { generateCard } from "./base.js";
import { fixCloseBtnPosition } from "./fixClosePos.js";

/**
 * イベント詳細のポップアップを表示する。
 * @param {EventInfo} eventInfo
 * @param {(()=>void) | null} onGoMapClick
 */
export function showEventCard(eventInfo, onGoMapClick = null) {
  const { card } = generateCard("event");
  appendEventContent(
    card,
    {
      title: eventInfo.title,
      operator: eventInfo.operator,
      eventImage: eventInfo.eventImage,
      description: eventInfo.description,
      times: eventInfo.times,
    },
    {
      prefix: "card",
      showDescription: true,
      onGoMapClick,
    },
  );
  fixCloseBtnPosition(card);
}
