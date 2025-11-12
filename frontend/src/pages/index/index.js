
import "./index.css";
import { getSplashUrl } from "../../scripts/lolStatic";

document.querySelector(".splash").src = await getSplashUrl("Zoe", 4);