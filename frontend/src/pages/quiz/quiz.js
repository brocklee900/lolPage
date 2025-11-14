import "./quiz.css";
import { testSupabase } from "../../scripts/supabase";
import { getChampionIcon } from "../../scripts/lolStatic";

const params = new URLSearchParams(window.location.search);
console.log(params.get("champion"));

const body = document.querySelector("body");
const icon = document.createElement("img");
icon.src = await getChampionIcon(params.get("champion"));
body.appendChild(icon);

const p = document.createElement("p");
p.textContent = params.get("champion");
body.appendChild(p);

