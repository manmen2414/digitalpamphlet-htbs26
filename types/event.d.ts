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
interface EventState {
  targetTime: string | null;
  leftMin: number;
  type: "inheld" | "soon" | "noheld" | "end";
  mainText: string;
  absoluteTimeText: string;
}
