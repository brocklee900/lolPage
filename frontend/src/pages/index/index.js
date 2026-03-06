
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

document.querySelector("#search").addEventListener("click", async (e) => {
    const platform = document.querySelector('input[name="platform"]:checked').value;
    const input = document.querySelector('#summonerSearch').value;
    if (!(input.includes("#"))) {
        alert("Name must contain tagline (i.e. #NA1)");
    } else {
        const [gameName, tagLine] = input.split('#');
        try {
            const topMasteries = await getTopMastery(platform, gameName, tagLine, 3);
            console.log(topMasteries);
        } catch (error) {
            alert("Summoner does not exist.");
        }
    }
});


