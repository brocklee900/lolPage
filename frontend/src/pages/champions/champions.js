import "./champions.css";
import { getAllLoadingSplash } from "../../scripts/lolStatic";

const body = document.querySelector("body");

const splashArts = await getAllLoadingSplash();
const url = "/quiz?champion=";
Object.keys(splashArts).forEach((key) => {
    let a = document.createElement("a");
    a.href = `${url}${key}`;
    body.appendChild(a);

    let img = document.createElement("img");
    img.src = splashArts[key];
    a.append(img);
});

console.log("championsPage");