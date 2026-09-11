/**
 * 時刻文字列 "HH:mm" を 00:00 からの経過分数に変換する
 * @param {string} timeStr - "HH:mm" 形式の文字列
 * @returns {number} 経過分数
 */
export function timeStrToMinutes(timeStr) {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}

/**
 * イベントの現在の開催状態と対象時刻を取得する
 *
 * @param {EventTime[]} times - イベント時間枠のリスト
 * @param {Date} [now=new Date()] - 基準日時（指定しない場合は現在時刻）
 * @param {boolean?} isPaused 休園中か
 * @returns {EventState}
 */
export function generateEventState(times, now = new Date(), isPaused = false) {
  if (isPaused)
    return {
      targetTime: null,
      leftMin: 0,
      absoluteTimeText: "休演中です",
      mainText: "休演",
      type: "end",
    };
  const currentMin = now.getHours() * 60 + now.getMinutes();

  // 時間枠を開始時間順にソート & 分数変換
  const formattedTimes = times.map((t) => ({
    ...t,
    startMin: timeStrToMinutes(t.start),
    endMin: timeStrToMinutes(t.end),
  }));

  // 現在開催中の枠を探す
  const currentEvent = formattedTimes.find(
    (t) => t.startMin <= currentMin && currentMin < t.endMin,
  );

  if (currentEvent) {
    const leftMin = currentEvent.endMin - currentMin;
    return {
      targetTime: currentEvent.end, // 開催中のため「終了時間」を返す
      leftMin,
      type: "inheld",
      mainText: "開催中",
      absoluteTimeText: `終了: ${currentEvent.end}`,
    };
  }

  // 次に開始予定の枠を探す
  const nextEvent = formattedTimes.find((t) => currentMin < t.startMin);

  if (nextEvent) {
    const leftMin = nextEvent.startMin - currentMin;
    return {
      targetTime: nextEvent.start, // 開催前のため「次の開始時間」を返す
      leftMin,
      type: leftMin <= 10 ? "soon" : "noheld",
      mainText: `${leftMin}分後`,
      absoluteTimeText: `開始: ${nextEvent.start}`,
    };
  }

  // 3. 全時程が終了している場合
  return {
    targetTime: null,
    leftMin: 0,
    type: "end",
    mainText: "終了",
    absoluteTimeText: "終了しました",
  };
}

/**
 * イベントテーブル用の行を組み立てる。
 * @param {string} title
 * @param {EventState} state
 * @param {string?} operator
 */
export function generateEventTableRow(title, state, operator) {
  const tr = document.createElement("tr");
  const th = document.createElement("th");
  th.className = "event-time-title";
  th.innerText = title;
  if (operator) {
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
