import "./style.css";
import "./smallcard.css";
import { initMap } from "./map/index.js";
import { initBoothPage, searchWithCategory } from "./booth/page.js";
import "./pageState.js";
import { showEventCard } from "./card/event";
import { getEventData } from "./event/eventData";
import { initEvent } from "./event/page";

initBoothPage();
initEvent();
initMap({ onBoothCategoryClick: searchWithCategory });
