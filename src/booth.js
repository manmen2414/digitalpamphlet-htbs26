import booths from "../env/boothinfo";
import {
  getAllBoothCategories,
  getBoothCategories,
  searchBooth,
} from "./boothutil";
import { addBoothComponentsToCard, closeCard, generateCard } from "./card";
import { MultiSelection } from "./MultiSelection";
import { pageState } from "./pageState";
import { generateSmallCard } from "./smallcard";

/**
 * @param {string} category
 */
function searchWithCategory(category) {
  if (!tagsInput) return;
  closeCard();
  tagsInput.setSelections([category]);
  pageState.page = "booth";
}

/**
 * @param {BoothInfo} boothInfo
 */
export function showBoothCard(boothInfo) {
  addBoothComponentsToCard(
    generateCard("booth").card,
    boothInfo.title,
    boothInfo.operator,
    boothInfo.boothImage,
    getBoothCategories(boothInfo),
    boothInfo.description,
    searchWithCategory,
  );
}
/**
 * @type {MultiSelection|null}
 */
let tagsInput = null;
function initBoothSearch() {
  /**@type {HTMLDivElement | null} */
  const categoriesInput = document.querySelector(
    "#booth-page .categories-input",
  );
  if (!categoriesInput) throw new Error("booth categories input not found");
  const categories = getAllBoothCategories();
  tagsInput = new MultiSelection(categoriesInput, categories);

  /**@type {HTMLInputElement | null} */
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
      showBoothCard(b);
    };
    return base;
  });

  const resultPane = document.querySelector("#booth-page .search-result-pane");
  if (!resultPane) throw new Error("booth result pane not found");

  resultPane.innerHTML = "";

  resultPane.append(...cards);
}

function initShowMode() {
  /**@type {HTMLDivElement | null} */
  const resultPane = document.querySelector("#booth-page .search-result-pane");
  if (!resultPane) throw new Error("booth result pane not found");
  /**@type {HTMLButtonElement|null} */
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
initBoothSearch();
initShowMode();
