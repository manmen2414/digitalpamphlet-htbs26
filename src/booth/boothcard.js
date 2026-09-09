import { appendBoothContent } from "./content.js";

/**
 * @param {string} title
 * @param {string|undefined} operator
 * @param {string|undefined} boothImage
 * @param {string[]} categories
 * @param {string} description
 */
export function generateBoothCard(
  title,
  operator,
  boothImage,
  categories = [],
  description = "",
) {
  const cardBase = document.createElement("div");
  cardBase.className = "smallcard-base";
  const cardElement = document.createElement("div");
  cardElement.className = `smallcard smallcard-booth`;
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
