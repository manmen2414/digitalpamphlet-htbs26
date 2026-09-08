/**
 * ポップアップとイベント一覧カードで共通の本文を組み立てる。
 *
 * @param {HTMLElement} root
 * @param {{
 *   title: string,
 *   operator?: string,
 *   eventImage?: string,
 *   category?: string,
 *   description?: string,
 *   times?: EventTime[],
 * }} data
 * @param {{
 *   prefix: string,
 *   showDescription?: boolean,
 *   categoryTag?: "button"|"div",
 *   onCategoryClick?: ((category: string) => void)|null,
 * }} options
 */
export function appendEventContent(root, data, options) {
  const {
    prefix,
    showDescription = true,
    categoryTag = "div",
    onCategoryClick = null,
  } = options;

  const header = document.createElement("div");
  header.className = `${prefix}-header`;
  root.appendChild(header);
  if (data.eventImage) {
    const img = document.createElement("img");
    img.src = data.eventImage;
    img.className = `${prefix}-img`;
    header.appendChild(img);
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

  const times = data.times ?? [];
  if (times.length > 0) {
    const timesEl = document.createElement("div");
    timesEl.className = `${prefix}-times`;
    timesEl.innerText = times.map((t) => `${t.start} – ${t.end}`).join(" / ");
    content.appendChild(timesEl);
  }

  if (showDescription) {
    const description = document.createElement("div");
    description.className = `${prefix}-desc`;
    description.innerText = data.description ?? "";
    content.appendChild(description);
  }

  const category = data.category;
  if (!category) return;

  const categoriesWrap = document.createElement("div");
  categoriesWrap.className = `${prefix}-categories`;
  content.appendChild(categoriesWrap);

  const categoryEl = document.createElement(categoryTag);
  categoryEl.className = `${prefix}-category`;
  categoryEl.innerText = category;
  if (onCategoryClick) {
    categoryEl.onclick = () => onCategoryClick(category);
  }
  categoriesWrap.appendChild(categoryEl);
}
