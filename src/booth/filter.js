export class Filter {
  /**@type {FilterSelection[]} */
  selections;
  /**@type {((filter:Filter)=>void )|null} */
  onchange = null;
  /**
   * @param {FilterSelection[]} selections
   */
  constructor(selections) {
    this.selections = [...selections];
  }

  /**
   * フィルター状態を設定する
   * @param {string} id
   * @param {boolean} state
   */
  set(id, state) {
    const selection = this.selections.find((s) => s.id === id);
    if (selection) selection.selected = state;
    if (this.onchange)
      try {
        this.onchange(this);
      } catch (ex) {
        console.error(ex);
      }
    return selection;
  }

  /**
   * フィルターを未設定にする
   */
  clear() {
    this.selections.forEach((s) => (s.selected = false));
    if (this.onchange)
      try {
        this.onchange(this);
      } catch (ex) {
        console.error(ex);
      }
  }

  /**
   * フィルター結果のidリストを取得する。
   * @param {boolean} includeAllIfNoSelect 選択されていない時全てのidを取得するか。
   */
  getFilteredId(includeAllIfNoSelect = false) {
    let selectedFilters = this.selections.filter((v) => v.selected);
    if (includeAllIfNoSelect && selectedFilters.length === 0)
      selectedFilters = this.selections;
    console.log(selectedFilters);
    return selectedFilters.map((v) => v.id);
  }
}
