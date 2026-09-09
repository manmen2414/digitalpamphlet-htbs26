/**
 * 閉じるボタン付きのベースポップアップを表示する。
 * @param {string} cardType
 */
export function generateCard(cardType) {
  const cardBase = document.createElement("div");
  cardBase.className = "card-base";
  const cardElement = document.createElement("div");
  cardElement.className = `bigcard card-${cardType}`;
  cardBase.appendChild(cardElement);

  cardElement.innerHTML += `<button class="card-close"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg></button>`;
  const closeBtn = cardElement.querySelector("button");
  if (!closeBtn) {
    throw new Error(
      "generateCard: failed to create card (no close button generated)",
    );
  }

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

export function closeCard() {
  /** @type {HTMLButtonElement[]} */
  // @ts-ignore
  const closeBtn = [...document.querySelectorAll("button.card-close")];
  closeBtn.forEach((b) => b.click());
}
