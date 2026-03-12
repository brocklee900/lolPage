
import "./index.css";
import { getRandomSplash, getTopMastery, getChampionIcon } from "../../scripts/riotDragon";
import { createPlaceholder } from "../../scripts/error";

const img = document.querySelector(".splash");
const data = await getRandomSplash("Zoe");
if (data) {
    img.src = data.data;
} else {
    img.src = data;
}

img.onerror = createPlaceholder;

async function createChampionCards(topMasteries) {
    const url = "/quiz?champion=";
    const display = document.querySelector("#userChampions");
    display.replaceChildren();
    for (let mastery of topMasteries) {

        let a = document.createElement("a");
        a.href = `${url}${mastery.championID}`;
        display.append(a);

        const div = document.createElement("div");
        div.classList.add("championCard");

        let h1 = document.createElement("h1");
        h1.textContent = mastery.championName;
        div.appendChild(h1);

        let img = document.createElement("img");
        img.src = (await getChampionIcon(mastery.championID)).data;
        div.appendChild(img);

        let p = document.createElement("p");
        p.textContent = `${mastery.championPoints}pts`;
        div.appendChild(p);

        a.appendChild(div);

    }
};

document.querySelector("#search").addEventListener("click", async (e) => {
    const platform = document.querySelector('input[name="platform"]:checked').value;
    const input = document.querySelector('#summonerSearch').value;
    if (!(input.includes("#"))) {
        alert("Name must contain tagline (i.e. #NA1)");
    } else {
        const [gameName, tagLine] = input.split('#');
        try {
            const topMasteries = await getTopMastery(platform, gameName, tagLine, 3);
            createChampionCards(topMasteries);
        } catch (error) {
            alert("Summoner does not exist.");
        }
    }
});


