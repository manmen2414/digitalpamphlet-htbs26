/**
 * 閉じるボタンの位置が画面外の場合、画面内に持ってくる。
 * @param {HTMLDivElement} card
 */
export function fixCloseBtnPosition(card) {
  /**@type {HTMLButtonElement | null} */
  const closeBtn = card.querySelector("button.card-close");
  if (!closeBtn) {
    throw new Error("no close button in card");
  }

  /** この値 + スクリーン縦サイズ よりカードの縦サイズが大きい場合位置を変更 */
  const MARGIN = 20;

  const cardH = card.clientHeight;
  const bodyH = document.body.clientHeight + MARGIN;
  if (bodyH > cardH) return;
  closeBtn.style.top = `${15 + (cardH - bodyH) / 2}px`;
}
