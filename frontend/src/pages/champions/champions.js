import "./champions.css";
import { getLoadingSplashUrl } from "../../scripts/lolStatic";

const body = document.querySelector("body");
let img = document.createElement("img");
body.appendChild(img);
img.src = await getLoadingSplashUrl("Aatrox", 0);


console.log("championsPage");