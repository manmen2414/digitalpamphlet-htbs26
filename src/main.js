import "./style.css";
import { initMap } from "./map/index.js";
import { initBoothPage, searchWithCategory } from "./booth/page.js";
import "./pageState.js";
import { initEvent } from "./event/page";

initBoothPage();
initEvent();
initMap({ onBoothCategoryClick: searchWithCategory });
