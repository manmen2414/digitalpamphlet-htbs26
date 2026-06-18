import "./card.css";

/**
 * @param {string} cardType
 * @param {string} title
 * @param {string|undefined} operator
 * @param {string|undefined} boothImage
 * @param {string[]} categories
 * @param {string} description
 */
function generateCard(
  cardType,
  title,
  operator,
  boothImage,
  categories = [],
  description = "",
) {
  const cardBase = document.createElement("div");
  cardBase.className = `card-base`;
  const cardElement = document.createElement("div");
  cardElement.className = `card card-${cardType}`;
  cardBase.appendChild(cardElement);

  cardElement.innerHTML += `<button class="card-close"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg></button>`;
  const closeBtn = cardElement.querySelector("button");
  if (!closeBtn)
    throw new Error(
      "generateCard: failed to create card (no close button generated)",
    );

  const cardHeader = document.createElement("div");
  cardHeader.className = "card-header";
  cardElement.appendChild(cardHeader);
  if (boothImage) {
    const img = document.createElement("img");
    img.src = boothImage;
    img.className = "card-img";
    // 仮
    cardHeader.appendChild(img);
  }
  const cardContent = document.createElement("div");
  cardContent.className = "card-content";
  cardElement.appendChild(cardContent);
  if (operator) {
    const operatorElement = document.createElement("div");
    operatorElement.className = "card-operator";
    operatorElement.innerText = operator;
    cardContent.appendChild(operatorElement);
  }
  const cardTitle = document.createElement("div");
  cardTitle.className = "card-title";
  cardTitle.innerText = title;
  cardContent.appendChild(cardTitle);
  const cardDescription = document.createElement("div");
  cardDescription.className = "card-desc";
  cardDescription.innerText = description;
  cardContent.appendChild(cardDescription);

  if (categories.length > 0) {
    const cardCategories = document.createElement("div");
    cardCategories.className = "card-categories";
    cardContent.appendChild(cardCategories);

    for (const category of categories) {
      const cardCategory = document.createElement("div");
      cardCategory.className = "card-category";
      cardCategory.innerText = category;
      cardCategories.appendChild(cardCategory);
    }
  }

  document.body.appendChild(cardBase);

  closeBtn.onclick = () => {
    cardElement.classList.add("closeing");
    setTimeout(() => {
      cardBase.remove();
    }, 200);
  };
}

export { generateCard };
