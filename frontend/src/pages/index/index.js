
import "./index.css";
import { getRandomSplash, getSummonerData } from "../../scripts/riotDragon";
import { createPlaceholder } from "../../scripts/error";

const img = document.querySelector(".splash");
const data = await getRandomSplash("Zoe");
if (data) {
    img.src = data.data;
} else {
    img.src = data;
}

img.onerror = createPlaceholder;

await getSummonerData("americas", "Brocklee900", "INT");