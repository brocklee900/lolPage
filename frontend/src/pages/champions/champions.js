import "./champions.css";
import { getAllLoadingSplash } from "../../scripts/lolStatic";
import { getPlaceholder } from "../../scripts/error";

const body = document.querySelector("body");

const splashArts = await getAllLoadingSplash();
if (splashArts) {

    const url = "/quiz?champion=";
    Object.keys(splashArts).forEach((key) => {
        let a = document.createElement("a");
        a.href = `${url}${key}`;
        body.appendChild(a);

        let img = document.createElement("img");
        img.src = splashArts[key];
        a.append(img);

    });
} else {
    body.appendChild(getPlaceholder());
}


console.log("championsPage");