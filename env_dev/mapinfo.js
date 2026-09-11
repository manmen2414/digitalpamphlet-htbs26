/// <reference path="../types/map.d.ts"/>
//
// env に合わせるときの要点:
// - floorFile は env フォルダからの相対パス（表示は /env/${floorFile}）
// - floors[0] が起動時に表示される階層
// - rooms[].boothIds は boothinfo.js の boothId と一致させる
// - 同じ部屋に boothIds が複数あると、クリック時に選択ポップアップが出る

/** @type {MapInfo} */
const map = {
  floors: [
    {
      floorFile: "map/floor1.svg",
      floorName: "1階",
      rooms: [
        {
          name: "部屋Aブース",
          boothIds: ["roomA", "roomA-2"],
          bounds: [
            [527.5657111883148, 379.15625],
            [690.1580065474543, 120.203125],
          ],
        },
        {
          name: "部屋B",
          bounds: [
            [418.24616353867117, 382.66506158755465],
            [512.8140552763917, 117.828125],
          ],
        },
        {
          name: "部屋C イベントあり",
          eventIds: ["test-event"],
          bounds: [
            [417.09507655927536, 619.984375],
            [691.3444818947726, 391.5],
          ],
        },
        {
          name: "部屋D 単一ブース",
          boothIds: ["1-3"],
          bounds: [
            [300, 380],
            [410, 120],
          ],
        },
      ],
    },
  ],
};

export default map;
