
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

document.querySelector("#search").addEventListener("click", (e) => {
    const platform = document.querySelector('input[name="platform"]:checked').value;
    console.log(platform);
});

const topMasteries = await getTopMastery("na1", "Brocklee900", "INT", 3);


