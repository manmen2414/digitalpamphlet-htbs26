import booths from "../env/boothinfo";
import {
  getAllBoothCategories,
  getBoothCategories,
  searchBooth,
} from "./boothutil";
import { MultiSelection } from "./MultiSelection";
import { generateSmallCard } from "./smallcard";

function initBoothSearch() {
  /**@type {HTMLDivElement | null} */
  const categoriesInput = document.querySelector(
    "#booth-page .categories-input",
  );
  if (!categoriesInput) throw new Error("booth categories input not found");
  const categories = getAllBoothCategories();
  const tagsInput = new MultiSelection(categoriesInput, categories);

  /**@type {HTMLInputElement | null} */
  const keywordInput = document.querySelector(
    "#booth-page .search-input input",
  );
  if (!keywordInput) throw new Error("booth keyword input not found");
  keywordInput.onkeyup = () => {
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
  const cards = booths.map((b) =>
    generateSmallCard(
      "booth",
      b.title,
      b.operator,
      b.boothImage,
      getBoothCategories(b),
      b.description,
    ),
  );

  const resultPane = document.querySelector("#booth-page .search-result-pane");
  if (!resultPane) throw new Error("booth result pane not found");

  resultPane.innerHTML = "";

  resultPane.append(...cards);
}
initBoothSearch();
