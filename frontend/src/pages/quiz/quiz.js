import "./quiz.css";
import { testSupabase, getQuestions } from "../../scripts/supabase";
import { getChampionIcon, getData } from "../../scripts/lolStatic";
import { createPlaceholder } from "../../scripts/error";

const params = new URLSearchParams(window.location.search);
console.log(params.get("champion"));

const body = document.querySelector("body");
const icon = document.createElement("img");
const data = await getChampionIcon(params.get("champion"));
if (data) {
    icon.src = data.data; //data exists
} else {
    icon.src = data; //data doesn't exist, set to error
}
icon.onerror = createPlaceholder;
body.appendChild(icon);

const p = document.createElement("p");
p.textContent = params.get("champion");
body.appendChild(p);

const video = document.createElement("video");
const videodata = await testSupabase(params.get("champion"), 3);
video.src = videodata;
video.onerror = createPlaceholder;
video.autoplay = true;
video.loop = true;
video.muted = true;
video.classList.add("gif");
body.appendChild(video);


const questionData = await getQuestions('Aatrox');
console.log('QuestionData');
console.log(questionData);





