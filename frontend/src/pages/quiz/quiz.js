import "./quiz.css";
import { testSupabase, getQuestions, getRandomQuestion } from "../../scripts/supabase";
import { getChampionIcon, getAnswerData } from "../../scripts/lolStatic";
import { createPlaceholder } from "../../scripts/error";

//When accessing quiz page, a champion must be included in the url params
//This will determine which questions to retrieve, 
//as they should pertain to the champion specified
const params = new URLSearchParams(window.location.search);
const championName = (params.get("champion")); 

const createAnswerBox = (answer_text) => {
    const answerDisplay = document.querySelector('#answerDisplay');
    let div = document.createElement('div');
    div.classList.add("answerBox");
    let text = document.createElement('p');
    text.textContent = answer_text;
    div.appendChild(text);
    answerDisplay.appendChild(div);
}

async function displayQuestion(questionData) {
    const qText = document.querySelector('#questionDisplay p');

    console.log(questionData);
    if (questionData.answer_source == 'database') {
        console.log('Pull data from supabase');
        qText.textContent = questionData.question_text;
        for (const answer of questionData.answers) {
            createAnswerBox(answer.answer_text);
        }
    } else {
        qText.textContent = questionData.question_text.replace("{championName}", championName);
        console.log('Pull data from lolstatic');
        let answer_endpoint = questionData.answer_endpoint.replace("{championName}", championName);
        let answer = await getAnswerData(answer_endpoint);
        createAnswerBox(answer.data);
    }
}

const body = document.querySelector("body");
const icon = document.createElement("img");
const data = await getChampionIcon(championName);
if (data) {
    icon.src = data.data; //data exists
} else {
    icon.src = data; //data doesn't exist, set to error
}
icon.onerror = createPlaceholder;
body.appendChild(icon);

const p = document.createElement("p");
p.textContent = championName;
body.appendChild(p);

const video = document.createElement("video");
const videodata = await testSupabase(championName, 1);
video.src = videodata.publicUrl;
video.onerror = createPlaceholder;
video.autoplay = true;
video.loop = true;
video.muted = true;
video.classList.add("gif");
body.appendChild(video);


const randQuestion = await getRandomQuestion(championName);
await displayQuestion(randQuestion);








