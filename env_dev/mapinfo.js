/// <reference path="../types/map.d.ts"/>

/**@type {MapInfo}*/
const map = {
  floors: [
    {
      floorFile: "floor1.svg",
      floorName: "1階",
      rooms: [
        {
          name: "部屋Aブース",
          boothId: "roomA",
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
          eventId: "roomCEvent",
          bounds: [
            [417.09507655927536, 619.984375],
            [691.3444818947726, 391.5],
          ],
        },
      ],
    },
  ],
};

export default map;
