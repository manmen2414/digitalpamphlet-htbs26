/**
 * ポップアップとブース一覧カードで共通のブース本文を組み立てる。
 *
 * @param {HTMLElement} root
 * @param {{
 *   title: string,
 *   operator?: string,
 *   boothImage?: string,
 *   categories?: string[],
 *   description?: string,
 * }} data
 * @param {{
 *   prefix: string,
 *   showDescription?: boolean,
 *   categoryTag?: "button"|"div",
 *   onCategoryClick?: ((category: string) => void)|null,
 *   onGoMapClick?: (() => void)|null,
 * }} options
 */
export function appendBoothContent(root, data, options) {
  const {
    prefix,
    showDescription = true,
    categoryTag = "div",
    onCategoryClick = null,
    onGoMapClick = null
  } = options;

  const header = document.createElement("div");
  header.className = `${prefix}-header`;
  root.appendChild(header);
  if (data.boothImage) {
    const img = document.createElement("img");
    img.src = data.boothImage;
    img.className = `${prefix}-img`;
    header.appendChild(img);
  }

  if(onGoMapClick){
    const goMapBtn = document.createElement("button");
    goMapBtn.className = `${prefix}-gomap`;
    goMapBtn.innerText = "マップで表示";
    goMapBtn.onclick = () => onGoMapClick();
    root.appendChild(goMapBtn) 
  }
  const content = document.createElement("div");
  content.className = `${prefix}-content`;
  root.appendChild(content);
  

  if (data.operator) {
    const operatorElement = document.createElement("div");
    operatorElement.className = `${prefix}-operator`;
    operatorElement.innerText = data.operator;
    content.appendChild(operatorElement);
  }

  const title = document.createElement("div");
  title.className = `${prefix}-title`;
  title.innerText = data.title;
  content.appendChild(title);

  if (showDescription) {
    const description = document.createElement("div");
    description.className = `${prefix}-desc`;
    description.innerText = data.description ?? "";
    content.appendChild(description);
  }

  const categories = data.categories ?? [];
  if (categories.length === 0) return;

  const categoriesWrap = document.createElement("div");
  categoriesWrap.className = `${prefix}-categories`;
  content.appendChild(categoriesWrap);

  for (const category of categories) {
    const categoryEl = document.createElement(categoryTag);
    categoryEl.className = `${prefix}-category`;
    categoryEl.innerText = category;
    if (onCategoryClick) {
      categoryEl.onclick = () => onCategoryClick(category);
    }
    categoriesWrap.appendChild(categoryEl);
  }

}
