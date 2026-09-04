export class MultiSelection {
  /**@type {undefined|((selections: string[])=>any)} */
  onUpdate;
  /**
   * @param {HTMLDivElement} category
   * @param {string[]} choices
   */
  constructor(category, choices) {
    this.category = category;
    this.choices = choices;
    this.category.onclick = () => {
      /**@type {HTMLSelectElement|null} */
      const selector = this.category.querySelector(".categories-select");
      if (!selector) return alert("ピッカーを表示できませんでした。");

      const selected = (this.category.getAttribute("selected") ?? "").split(
        ",",
      );
      selector.innerHTML = `
      <option value="" selected></option>
      <option value="unsel">※ 選択解除 ※</option>
    `;
      selector.append(
        ...choices.map((choice, index) => {
          const option = document.createElement("option");
          option.value = `${index}`;
          const isSelected = selected.includes(option.value);
          option.innerText = (isSelected ? "✅" : "") + choice;
          return option;
        }),
      );

      selector.showPicker();
    };

    const selector = this.category.querySelector(".categories-select");
    if (!selector || !(selector instanceof HTMLSelectElement)) return;

    selector.onchange = (ev) => {
      const selector = ev.target;
      if (!selector || !(selector instanceof HTMLSelectElement)) return;
      let selected = this.getSelectionsIndex();
      const isSelected = selected.includes(selector.value);
      if (isSelected) selected = selected.filter((id) => id !== selector.value);
      else selected.push(selector.value);
      if (selector.value === "unsel") selected = [];
      this.category.setAttribute("selected", selected.join());

      this.#update();
    };
  }

  #update() {
    const text = this.category.getElementsByTagName("span").item(0);
    if (!text) return;
    const selections = this.getSelections();
    text.innerText = selections.join(", ");
    if (this.onUpdate) this.onUpdate(selections);
    if (this.getSelectionsIndex().length === 0) text.innerText = "指定なし";
  }

  getSelectionsIndex() {
    return (this.category.getAttribute("selected") ?? "")
      .split(",")
      .filter((s) => s.length !== 0);
  }
  getSelections() {
    return this.getSelectionsIndex().map((id) => this.choices[parseInt(id)]);
  }
  /**
   * @param {string[]} selections
   */
  setSelections(selections) {
    this.category.setAttribute(
      "selected",
      selections
        .map((v) => this.choices.indexOf(v))
        .filter((n) => n !== -1)
        .join(),
    );

    this.#update();
  }
}
