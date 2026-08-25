interface BoothInfo {
  /** ブースのID。 */
  boothId: string;
  /** ブース名。 */
  title: string;
  /** ブースの運営者。 */
  operator: string;
  /** env上のブース画像へのパス。 */
  boothImage?: string;
  /** ブースのカテゴリ。 */
  category: BoothCategory;
  /** ブースの説明。 */
  description?: string;
  /** ブースのハッシュタグ(仮)。 */
  tags: string[];
}

type BoothCategory =
  | "食べ物"
  | "アミューズメント"
  | "展示"
  | "物品"
  | "体験"
  | "その他";
