import booths from "../../public/env/boothinfo";
import { Filter } from "./filter";

/** @param {BoothInfo} booth */
export function getBoothCategories(booth) {
  const categories = [booth.category, ...booth.tags];
  const classReg = /^([0-9])-[0-9]$/.exec(booth.boothId);
  if (classReg) categories.push(`${classReg[1]}年生`);
  return categories;
}

export function getAllBoothCategories() {
  /** @type {Set<string>} */
  const categories = new Set(booths.flatMap((b) => [b.category, ...b.tags]));

  booths.forEach((booth) => {
    const classReg = /^([0-9])-[0-9]$/.exec(booth.boothId);
    if (classReg) {
      categories.add(`${classReg[1]}年生`);
    }
  });

  return Array.from(categories);
}

/**
 * @param {string} keyword
 * @param {Filter} filter
 */
export function searchBooth(keyword, filter) {
  const filterIds = filter.getFilteredId();
  const keywords = keyword.split(/[\s　]/).filter((v) => !!v);
  return booths.filter((b) => {
    const searchText = b.title + b.description + b.operator;
    return (
      keywords.every((k) => searchText.includes(k)) &&
      filterIds.every((id) => getBoothCategories(b).includes(id))
    );
  });
}

/**
 * @param {string} boothId
 */
export function getBooth(boothId) {
  return booths.find((b) => b.boothId === boothId);
}

/**
 * @param {string[]} boothIds
 * @returns {BoothInfo[]}
 */
export function getBoothsByIds(boothIds) {
  return boothIds.flatMap((id) => {
    const booth = getBooth(id);
    return booth ? [booth] : [];
  });
}

export function getAllBooths() {
  return booths;
}
