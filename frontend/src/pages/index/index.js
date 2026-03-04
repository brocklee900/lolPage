
import "./index.css";
import { getRandomSplash, getTopMastery } from "../../scripts/riotDragon";
import { createPlaceholder } from "../../scripts/error";

const img = document.querySelector(".splash");
const data = await getRandomSplash("Zoe");
if (data) {
    img.src = data.data;
} else {
    img.src = data;
}

img.onerror = createPlaceholder;

const topMasteries = await getTopMastery("americas", "Brocklee900", "INT", 3);
console.log(topMasteries);