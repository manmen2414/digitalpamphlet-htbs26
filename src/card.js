import "./card.css";

/**
 * @param {string} cardType
 */
function generateCard(cardType) {
  const cardBase = document.createElement("div");
  cardBase.className = `card-base`;
  const cardElement = document.createElement("div");
  cardElement.className = `bigcard card-${cardType}`;
  cardBase.appendChild(cardElement);

  cardElement.innerHTML += `<button class="card-close"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg></button>`;
  const closeBtn = cardElement.querySelector("button");
  if (!closeBtn)
    throw new Error(
      "generateCard: failed to create card (no close button generated)",
    );

  document.body.appendChild(cardBase);

  closeBtn.onclick = () => {
    cardElement.classList.add("closeing");
    setTimeout(() => {
      cardBase.remove();
    }, 150);
  };

  return {
    card: cardElement,
    base: cardBase,
  };
}
/**
 * @param {HTMLDivElement} card
 * @param {string} title
 * @param {string|undefined} operator
 * @param {string|undefined} boothImage
 * @param {string[]} categories
 * @param {string} description
 * @param {((clicked:string)=>any)|null} categoriesOnclick
 */
function addBoothComponentsToCard(
  card,
  title,
  operator,
  boothImage,
  categories = [],
  description = "",
  categoriesOnclick = null,
) {
  const cardHeader = document.createElement("div");
  cardHeader.className = "card-header";
  card.appendChild(cardHeader);
  if (boothImage) {
    const img = document.createElement("img");
    img.src = boothImage;
    img.className = "card-img";
    // 仮
    cardHeader.appendChild(img);
  }
  const cardContent = document.createElement("div");
  cardContent.className = "card-content";
  card.appendChild(cardContent);
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
      const cardCategory = document.createElement("button");
      cardCategory.className = "card-category";
      cardCategory.innerText = category;
      cardCategories.appendChild(cardCategory);

      cardCategory.onclick = () => {
        if (categoriesOnclick) categoriesOnclick(category);
      };
    }
  }
}

/**
 * @param {HTMLDivElement} card type: selections
 * @param {[string,()=>void][]} selections
 * @param {string} label
 */
function addSelectionsToCard(card, selections, label = "選択") {
  const btns = selections.map(([text, click]) => {
    const b = document.createElement("button");
    b.innerText = text;
    b.onclick = () => click();
    return b;
  });

  const text = document.createElement("div");
  text.innerText = label;
  card.append(text, ...btns);
}

export function closeCard() {
  /**@type {HTMLButtonElement[]} */
  //@ts-ignore
  const closeBtn = [...document.querySelectorAll("button.card-close")];
  closeBtn.forEach((b) => b.click());
}

export { generateCard, addBoothComponentsToCard, addSelectionsToCard };
