import "./champions.css";
import { getAllLoadingSplash } from "../../scripts/lolStatic";

const body = document.querySelector("body");

const splashArts = await getAllLoadingSplash();
Object.keys(splashArts).forEach((key) => {
    let img = document.createElement("img");
    body.appendChild(img);
    img.src = splashArts[key];
});

console.log("championsPage");