import "./smallcard.css";
import { appendBoothContent } from "./booth/content.js";

/**
 * @param {string} cardType
 * @param {string} title
 * @param {string|undefined} operator
 * @param {string|undefined} boothImage
 * @param {string[]} categories
 * @param {string} description
 */
export function generateSmallCard(
  cardType,
  title,
  operator,
  boothImage,
  categories = [],
  description = "",
) {
  const cardBase = document.createElement("div");
  cardBase.className = "smallcard-base";
  const cardElement = document.createElement("div");
  cardElement.className = `smallcard smallcard-${cardType}`;
  cardBase.appendChild(cardElement);

  appendBoothContent(
    cardElement,
    { title, operator, boothImage, categories, description },
    {
      prefix: "smallcard",
      showDescription: false,
      categoryTag: "div",
    },
  );

  return cardBase;
}
