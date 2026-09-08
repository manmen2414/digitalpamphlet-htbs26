import "./style.css";
import { initMap } from "./map/index.js";
import { initBoothPage, searchWithCategory } from "./booth/page.js";
import "./pageState.js";
import { generateCard } from "./card/index.js";

initBoothPage();
initMap({ onBoothCategoryClick: searchWithCategory });
