import { appendEventContent } from "./content.js";

/**
 * @param {string} title
 * @param {string|undefined} operator
 * @param {string|undefined} eventImage
 * @param {EventTime[]} times
 * @param {EventState} eventState
 */
export function generateEventCard(
  title,
  operator,
  eventImage,
  times,
  eventState,
) {
  const cardBase = document.createElement("div");
  cardBase.className = "smallcard-base";
  const cardElement = document.createElement("div");
  cardElement.className = `smallcard smallcard-booth`;
  cardBase.appendChild(cardElement);

  appendEventContent(
    cardElement,
    { title, operator, eventImage, times },
    {
      prefix: "smallcard",
      showTimes: false,
      showDescription: false,
    },
  );

  /**
   * @type {HTMLDivElement|null}
   */
  const timesElement = document.createElement("div");
  timesElement.className = "smallcard-times";
  const mainTextSpan = document.createElement("span");
  mainTextSpan.classList.add(
    `event-state-main`,
    `event-state-${eventState.type}`,
  );
  mainTextSpan.innerText = eventState.mainText;
  const timeTextSpan = document.createElement("span");
  timeTextSpan.classList.add(`event-state-time`);
  timeTextSpan.innerText = eventState.absoluteTimeText;
  timesElement.innerHTML = "";
  timesElement.append(mainTextSpan, timeTextSpan);
  const content = cardElement.querySelector(".smallcard-content");
  content?.append(timesElement);

  return cardBase;
}
