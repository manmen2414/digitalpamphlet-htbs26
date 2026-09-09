import { Filter } from "../booth/filter";

/**
 * @param {HTMLDivElement} card
 * @param {Filter} filter
 * @param {string} label
 */
export function addFiltersToCard(card, filter, label = "タグ絞り込み") {
  /**
   * @param {HTMLInputElement} elem
   */
  function onchange(elem) {
    filter.set(elem.value, elem.checked);
  }

  const resetBtn = document.createElement("button");
  resetBtn.className = "card-reset";
  resetBtn.innerText = "リセット";
  resetBtn.onclick = () => {
    filter.clear();
    /**@type {HTMLButtonElement | null} */
    const close = card.querySelector(".card-close");
    close?.click();
  };

  const wrap = document.createElement("div");
  wrap.className = "card-filters-wrap";

  const text = document.createElement("div");
  text.innerText = label;
  wrap.appendChild(text);

  const group = document.createElement("div");
  group.className = "filter-group";

  group.append(
    ...filter.selections.map(({ id, label, selected }) => {
      const labelElem = document.createElement("label");
      const input = document.createElement("input");
      input.type = "checkbox";
      input.value = id;
      input.checked = selected;
      input.onchange = (ev) => {
        const cTarget = ev.currentTarget;
        if (!cTarget || !(cTarget instanceof HTMLInputElement))
          throw new Error("input change event currentTarget must be input");
        onchange(cTarget);
      };
      labelElem.append(input, label);
      return labelElem;
    }),
  );

  wrap.append(group);

  card.append(resetBtn, wrap);
}
