import booths from "../env/boothinfo";

/**@param {BoothInfo} booth  */
export function getBoothCategories(booth) {
  const categories = [booth.category, ...booth.tags];
  const classReg = /^([0-9])-[0-9]$/.exec(booth.boothId);
  if (classReg) categories.push(`${classReg[1]}年生`);
  return categories;
}

export function getAllBoothCategories() {
  /**@type {Set<string>} */
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
 * @param {string[]} tags AND selection
 */
export function searchBooth(keyword, tags) {
  return booths.filter(
    (b) =>
      (b.title + b.description).includes(keyword) &&
      tags.every((t) => getBoothCategories(b).includes(t)),
  );
}

/**
 * @param {string} boothId
 */
export function getBooth(boothId) {
  return booths.find((b) => b.boothId === boothId);
}
