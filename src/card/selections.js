import { fixCloseBtnPosition } from "./fixClosePos";

/**
 * @param {HTMLDivElement} card
 * @param {[string, () => void][]} selections
 * @param {string} label
 */
export function addSelectionsToCard(card, selections, label = "選択") {
  const wrap = document.createElement("div");
  wrap.className = "card-selections";

  const text = document.createElement("div");
  text.innerText = label;
  wrap.appendChild(text);

  for (const [caption, click] of selections) {
    const button = document.createElement("button");
    button.innerText = caption;
    button.onclick = () => click();
    wrap.appendChild(button);
  }

  card.appendChild(wrap);

  fixCloseBtnPosition(card);
}
