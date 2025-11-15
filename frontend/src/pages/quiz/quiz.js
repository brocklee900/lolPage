import "./quiz.css";
import { testSupabase } from "../../scripts/supabase";
import { getChampionIcon } from "../../scripts/lolStatic";
import { createPlaceholder } from "../../scripts/error";

const params = new URLSearchParams(window.location.search);
console.log(params.get("champion"));

const body = document.querySelector("body");
const icon = document.createElement("img");
const data = await getChampionIcon(params.get("champion"));
if (data) {
    icon.src = data.data;
} else {
    icon.src = data;
}
icon.onerror = createPlaceholder;
body.appendChild(icon);

const p = document.createElement("p");
p.textContent = params.get("champion");
body.appendChild(p);

