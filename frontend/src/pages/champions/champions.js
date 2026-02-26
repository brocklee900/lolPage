import "./champions.css";
import { getAllChampionIcon } from "../../scripts/riotDragon";
import { getPlaceholder } from "../../scripts/error";

const display = document.querySelector("div#championCollection");

const icons = await getAllChampionIcon();
if (icons) {

    const url = "/quiz?champion=";
    Object.keys(icons).forEach((key) => {
        let a = document.createElement("a");
        a.href = `${url}${key}`;
        display.appendChild(a);

        let img = document.createElement("img");
        img.src = icons[key];
        a.append(img);

    });
} else {
    display.appendChild(getPlaceholder());
}


console.log("championsPage");