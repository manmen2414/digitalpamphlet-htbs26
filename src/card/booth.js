import { appendBoothContent } from "../booth/content.js";
import { getBoothCategories } from "../booth/data.js";
import { generateCard } from "./base.js";
import { fixCloseBtnPosition } from "./fixClosePos.js";

/**
 * ブース詳細のポップアップを表示する。
 * @param {BoothInfo} boothInfo
 * @param {((clicked: string) => any)|null} [onCategoryClick]
 * @param {(() => any)|null} [onGoMapClick]
 */
export function showBoothCard(
  boothInfo,
  onCategoryClick = null,
  onGoMapClick = null,
) {
  const { card } = generateCard("booth");
  appendBoothContent(
    card,
    {
      title: boothInfo.title,
      operator: boothInfo.operator,
      boothImage: boothInfo.boothImage,
      categories: getBoothCategories(boothInfo),
      description: boothInfo.description,
    },
    {
      prefix: "card",
      showDescription: true,
      categoryTag: "button",
      onCategoryClick,
      onGoMapClick,
    },
  );
  fixCloseBtnPosition(card);
}
