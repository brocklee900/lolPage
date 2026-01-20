import "./quiz.css";
import { testSupabase, getQuestions, getRandomQuestion } from "../../scripts/supabase";
import { getChampionIcon } from "../../scripts/lolStatic";
import { createPlaceholder } from "../../scripts/error";

const createAnswerBox = (answer) => {
    const answerDisplay = document.querySelector('#answerDisplay');
    let div = document.createElement('div');
    div.classList.add("answerBox");
    let text = document.createElement('p');
    text.textContent = answer.answer_text;
    div.appendChild(text);
    answerDisplay.appendChild(div);
}

const displayQuestion = (questionData) => {
    const qText = document.querySelector('#questionDisplay p');

    console.log(questionData);
    if (questionData.answer_source == 'database') {
        console.log('Pull data from supabase');
        qText.textContent = questionData.question_text;
        for (const answer of questionData.answers) {
            createAnswerBox(answer);
        }
    } else {
        console.log('Pull data from lolstatic');
    }
}

//When accessing quiz page, a champion must be included in the url params
//This will determine which questions to retrieve, 
//as they should pertain to the champion specified
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


const randQuestion = await getRandomQuestion(`Aatrox`);
displayQuestion(randQuestion);








