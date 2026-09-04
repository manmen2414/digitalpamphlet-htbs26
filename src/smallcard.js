import "./smallcard.css";

/**
 * @param {string} cardType
 * @param {string} title
 * @param {string|undefined} operator
 * @param {string|undefined} boothImage
 * @param {string[]} categories
 * @param {string} description
 */
function generateSmallCard(
  cardType,
  title,
  operator,
  boothImage,
  categories = [],
  description = "",
) {
  const cardBase = document.createElement("div");
  cardBase.className = `smallcard-base`;
  const cardElement = document.createElement("div");
  cardElement.className = `smallcard smallcard-${cardType}`;
  cardBase.appendChild(cardElement);

  const cardHeader = document.createElement("div");
  cardHeader.className = "smallcard-header";
  cardElement.appendChild(cardHeader);
  if (boothImage) {
    const img = document.createElement("img");
    img.src = boothImage;
    img.className = "smallcard-img";
    // 仮
    cardHeader.appendChild(img);
  }
  const cardContent = document.createElement("div");
  cardContent.className = "smallcard-content";
  cardElement.appendChild(cardContent);
  if (operator) {
    const operatorElement = document.createElement("div");
    operatorElement.className = "smallcard-operator";
    operatorElement.innerText = operator;
    cardContent.appendChild(operatorElement);
  }
  const cardTitle = document.createElement("div");
  cardTitle.className = "smallcard-title";
  cardTitle.innerText = title;
  cardContent.appendChild(cardTitle);
  const cardDescription = document.createElement("div");
  cardDescription.className = "smallcard-desc";
  cardDescription.innerText = description;
  // cardContent.appendChild(cardDescription);

  if (categories.length > 0) {
    const cardCategories = document.createElement("div");
    cardCategories.className = "smallcard-categories";
    cardContent.appendChild(cardCategories);

    for (const category of categories) {
      const cardCategory = document.createElement("div");
      cardCategory.className = "smallcard-category";
      cardCategory.innerText = category;
      cardCategories.appendChild(cardCategory);
    }
  }

  return cardBase;
}

export { generateSmallCard };
