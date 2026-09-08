/** @type {BoothInfo[]} */
const booths = [
  {
    boothId: "roomA",
    category: "展示",
    operator: "1年A組",
    title: "サンプルブースA",
    description:
      "開発用のダミーブースです。マップの「部屋Aブース」をクリックすると、同じ部屋の別ブースとの選択画面が出ます。",
    tags: ["体験可", "写真OK"],
  },
  {
    boothId: "roomA-2",
    category: "食べ物",
    operator: "2年B組",
    title: "サンプルブースA-2",
    description:
      "同じ部屋に複数ブースがある場合の選択ポップアップ確認用です。",
    tags: ["販売"],
  },
  {
    boothId: "1-3",
    category: "体験",
    operator: "1年3組",
    title: "学年タグ確認用ブース",
    description:
      "boothId が「学年-組」の形式だと、カテゴリに「1年生」が自動追加されます。",
    tags: ["体験可"],
  },
];

export default booths;
