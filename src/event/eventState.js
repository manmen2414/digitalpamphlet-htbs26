import { hourMinute } from "../util";

/**
 * @param {EventTime[]} times
 * @returns {EventState}
 */
export function generateEventState(times) {
  const now = new Date(),
    ho = now.getHours(),
    mi = now.getMinutes();
  const soonTime = times
    .flatMap(({ start, end }) => {
      const [startH, startM, endH, endM] = `${start}:${end}`
        .split(":")
        .map((i) => parseInt(i));
      if (endH < ho) return [];
      if (endH === ho && endM <= mi) return [];
      return [{ startH, startM, endH, endM }];
    })[0];
  if (!soonTime)
    return {
      type: "end",
      mainText: "終了",
      absoluteTimeText: "終了しました",
      leftMin: NaN,
    };

  const leftMin = soonTime.startH * 60 + soonTime.startM - (ho * 60 + mi);
  if (soonTime.startH < ho || (soonTime.startH == ho && soonTime.startM <= mi))
    return {
      type: "inheld",
      mainText: "開催中",
      absoluteTimeText: `終了: ${hourMinute(soonTime.endH, soonTime.endM)}`,
      leftMin,
    };

  return {
    type: leftMin <= 10 ? "soon" : "noheld",
    mainText: `${leftMin}分後`,
    absoluteTimeText: `開始: ${hourMinute(soonTime.startH, soonTime.startM)}`,
    leftMin,
  };
}

/**
 * イベントテーブル用の行を組み立てる。
 * @param {string} title
 * @param {EventState} state
 * @param {string?} operator
 */
export function generateEventTableRow(title, state,operator) {
  const tr = document.createElement("tr");
  const th = document.createElement("th");
  th.className = "event-time-title";
  th.innerText = title;
  if(operator){
    const thSpan = document.createElement("span");
    thSpan.className = "event-time-title-op";
    thSpan.innerText = `(${operator})`;
    th.append(thSpan);
  }
  const mainTd = document.createElement("td");
  mainTd.className = `event-state-main event-state-${state.type}`;
  mainTd.innerText = state.mainText;
  const timeTd = document.createElement("td");
  timeTd.className = `event-state-time`;
  timeTd.innerText = state.absoluteTimeText;
  tr.append(th, mainTd, timeTd);
  return tr;
}
