
import "./index.css";
import { getSplashUrl, getRandomSplashUrl } from "../../scripts/lolStatic";

document.querySelector(".splash").src = await getRandomSplashUrl("Zoe");
