import {
  getAllBoothCategories,
  getAllBooths,
  getBoothCategories,
  searchBooth,
} from "./data.js";
import { closeCard } from "../card/base.js";
import { showBoothCard } from "../card/booth.js";
import { MultiSelection } from "../MultiSelection.js";
import { pageState } from "../pageState.js";
import { generateSmallCard } from "../smallcard.js";

/**
 * @type {MultiSelection|null}
 */
let tagsInput = null;

/**
 * カテゴリからブース一覧を開き、そのタグで絞り込む。
 * @param {string} category
 */
export function searchWithCategory(category) {
  if (!tagsInput) return;
  closeCard();
  tagsInput.setSelections([category]);
  pageState.page = "booth";
}

function initBoothSearch() {
  /** @type {HTMLDivElement | null} */
  const categoriesInput = document.querySelector(
    "#booth-page .categories-input",
  );
  if (!categoriesInput) throw new Error("booth categories input not found");
  const categories = getAllBoothCategories();
  tagsInput = new MultiSelection(categoriesInput, categories);

  /** @type {HTMLInputElement | null} */
  const keywordInput = document.querySelector(
    "#booth-page .search-input input",
  );
  if (!keywordInput) throw new Error("booth keyword input not found");
  keywordInput.onkeyup = () => {
    if (!tagsInput) return;
    updateBooth(searchBooth(keywordInput.value, tagsInput.getSelections()));
  };
  tagsInput.onUpdate = (sel) => {
    updateBooth(searchBooth(keywordInput.value, sel));
  };
}

/**
 * @param {BoothInfo[]} booths
 */
function updateBooth(booths) {
  const cards = booths.map((b) => {
    const base = generateSmallCard(
      "booth",
      b.title,
      b.operator,
      b.boothImage,
      getBoothCategories(b),
      b.description,
    );
    base.onclick = () => {
      showBoothCard(b, searchWithCategory);
    };
    return base;
  });

  const resultPane = document.querySelector("#booth-page .search-result-pane");
  if (!resultPane) throw new Error("booth result pane not found");

  resultPane.innerHTML = "";
  resultPane.append(...cards);
}

function initShowMode() {
  /** @type {HTMLDivElement | null} */
  const resultPane = document.querySelector("#booth-page .search-result-pane");
  if (!resultPane) throw new Error("booth result pane not found");
  /** @type {HTMLButtonElement|null} */
  const showmodeBtn = document.querySelector("#booth-showmode");
  if (!showmodeBtn) throw new Error("booth-showmode button not found");

  showmodeBtn.onclick = () => {
    const nowList = resultPane.classList.contains("showstyle-list");
    resultPane.classList.remove("showstyle-list");
    resultPane.classList.remove("showstyle-card");
    resultPane.classList.add(nowList ? "showstyle-card" : "showstyle-list");
    showmodeBtn.innerText = nowList ? "list" : "cards_stack";
  };
}

export function initBoothPage() {
  initBoothSearch();
  initShowMode();
  updateBooth(getAllBooths());
}
