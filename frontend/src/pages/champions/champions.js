import "./champions.css";
import { getLoadingSplashUrl } from "../../scripts/lolStatic";

const body = document.querySelector("body");
let img = document.createElement("img");
img.src = await getLoadingSplashUrl("Aatrox", 0);
body.appendChild(img);


console.log("championsPage");