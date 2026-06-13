/**
 * (条件1,結果1,条件2,結果2,条件3,結果3,...)のように値を渡して条件が合ったタイミングで結果を返す。\
 * いずれの条件も合わなければundefinedが帰ってくる。
 *
 * @param {...any} args
 */
function multiSelect(...args) {
  /**@type {boolean|undefined} */
  let condition = undefined;
  for (const arg of args) {
    if (typeof condition === "undefined") {
      condition = !!arg;
      continue;
    }
    if (condition) return arg;
    else condition = undefined;
  }
}

export { multiSelect };
