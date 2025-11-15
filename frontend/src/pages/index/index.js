
import "./index.css";
import { getSplashUrl, getRandomSplashUrl } from "../../scripts/lolStatic";
import { createPlaceholder } from "../../scripts/error";

const img = document.querySelector(".splash");
const data = await getRandomSplashUrl("Zoe");
if (data) {
    img.src = data.data;
} else {
    img.src = data;
}

img.onerror = createPlaceholder;
