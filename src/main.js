import "./style.css";
import { initMap } from "./map/index.js";
import { initBoothPage, searchWithCategory } from "./booth/page.js";
import "./pageState.js";
import { showEventCard } from "./card/event";

initBoothPage();
initMap({ onBoothCategoryClick: searchWithCategory });

showEventCard({
  eventId: "test-event",
  eventImage: "images/event-test.png",
  title: "テストイベント",
  times: [
    {
      start: "1000",
      end: "1100",
    },
    {
      start: "1200",
      end: "1300",
    },
  ],
  category: "展示",
  description: "開発用のダミーイベントです。",
  operator: "実行委員会",
});
