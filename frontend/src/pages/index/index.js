
import "./index.css";
import { getRandomSplash, getTopMastery, getChampionIcon } from "../../scripts/riotDragon";
import { createPlaceholder } from "../../scripts/error";

/*
const img = document.querySelector(".splash");
const data = await getRandomSplash("Zoe");
if (data) {
    img.src = data.data;
} else {
    img.src = data;
}

img.onerror = createPlaceholder;
*/

async function createChampionCards(topMasteries) {
    const url = "/quiz?champion=";
    const display = document.querySelector("#userChampions");
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

function displayError(error) {
    const errorDisplay = document.querySelector("#errorMessage");
    errorDisplay.textContent = error;
}

document.querySelector("#search").addEventListener("click", async (e) => {
    const platform = document.querySelector("#searchBar .dropdown .dropdown-toggle").textContent.slice(0,-2).toLowerCase();
    const input = document.querySelector('#summonerSearch').value;
    document.querySelector("#userChampions").replaceChildren();
    if (!(input.includes("#"))) {
        displayError("Name must contain tagline (i.e. #NA1)");
    } else {
        const [gameName, tagLine] = input.split('#');
        try {
            const topMasteries = await getTopMastery(platform, gameName, tagLine, 3);
            createChampionCards(topMasteries);
            displayError("");
        } catch (error) {
            displayError("Summoner does not exist");
        }
    }
});

const toggle = document.querySelector('.dropdown-toggle');
const menu = document.querySelector('.dropdown-menu');
toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.classList.toggle('open');
});

document.addEventListener('click', () => {
    menu.classList.remove('open');
})

menu.addEventListener('click', (e) => {
    if (e.target.tagName === "LI") {
        toggle.textContent = e.target.textContent + ' \u25BE';
        menu.classList.remove('open');
        console.log(toggle.textContent);
    }
})


