interface EventTime {
  /** 開始時刻。 */
  start: string;
  /** 終了時刻。 */
  end: string;
}

interface EventInfo {
  /** イベントのID。 */
  eventId: string;
  /** env上のイベント画像へのパス。 */
  eventImage: string;
  /** イベント名。 */
  title: string;
  /** 開催時間。 */
  times: EventTime[];
  /** イベントのカテゴリ。 */
  category: string;
  /** イベントの説明。 */
  description: string;
  /** イベントの運営者。 */
  operator: string;
}

interface EventState{
  type:"noheld"|"soon"|"inheld"|"end",
  /**
   * 状態を表すテキスト
   */
  mainText:string,
  /**
   * 相対的でない時間の表示
   */
  absoluteTimeText:string,
  /**
   * 残り時間(分)
   */
  leftMin: number
}
