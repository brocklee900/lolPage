import "./quiz.css";
import { getChampionIcon, getAnswerData } from "../../scripts/riotDragon";
import { createPlaceholder } from "../../scripts/error";
import { createQuiz } from "../../scripts/quizManager";
import { testSupabase } from "../../scripts/supabase";

//When accessing quiz page, a champion must be included in the url params
//This will determine which questions to retrieve, 
//as they should pertain to the champion specified
const params = new URLSearchParams(window.location.search);
const championName = (params.get("champion")); 
const quizManager = createQuiz(championName);
disableDisplays();

const createAnswerBox = (answerText) => {
    const answerDisplay = document.querySelector('#answerDisplay');
    let div = document.createElement('div');
    div.classList.add("answerBox");
    let text = document.createElement('p');
    text.textContent = answerText;
    div.appendChild(text);
    answerDisplay.appendChild(div);
}

async function displayQuestion(questionData) {
    const qText = document.querySelector('#questionDisplay p');
    document.querySelector('#answerDisplay').replaceChildren();

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

function checkMultipleChoiceCorrect(guess) {
    const answer_text = guess.querySelector("p").textContent
    const [result, correct] = quizManager.checkMultipleChoiceCorrect(answer_text);
    if (result) {
        guess.classList.add("true");
    } else {
        guess.classList.add("false");
        let answers = [...document.querySelector("div#answerDisplay").children];
        let correctDiv = answers.find(a => a.querySelector("p").textContent == correct);
        correctDiv.classList.add("true");
    }

}

function disableDisplays() {
    const quizState = quizManager.quizState;

    const startBtn = document.querySelector("button#start");
    const nextBtn = document.querySelector("button#next");
    const answerDisplay = document.querySelector("div#answerDisplay");
    switch (quizState) {
        case ("INACTIVE"):
            startBtn.classList.remove("disabled");
            nextBtn.classList.add("disabled");
            answerDisplay.classList.add("disabled");
            break;
        case ("GUESSING"):
            startBtn.classList.add("disabled");
            nextBtn.classList.add("disabled");
            answerDisplay.classList.remove("disabled");
            break;
        case ("WAIT_NEXT"):
            startBtn.classList.add("disabled");
            nextBtn.classList.remove("disabled");
            answerDisplay.classList.add("disabled");
            break;
    }
}

const NUM_QUESTIONS = 5;
document.querySelector("button#start").addEventListener("click", async (e) => {
    await quizManager.createQuestionSet(NUM_QUESTIONS);
    displayQuestion(quizManager.getNextQuestion());
    disableDisplays();
});

document.querySelector("button#next").addEventListener("click", (e) => {
    let question = quizManager.getNextQuestion();
    if (question) {
        displayQuestion(question);
        disableDisplays();
    } else {
        let score = document.createElement("p");
        score.textContent = `Score: ${quizManager.score}/${NUM_QUESTIONS}`;
        document.querySelector("div#answerDisplay").replaceChildren(score);
        disableDisplays();
    };
});

document.querySelector("div#answerDisplay").addEventListener("click", (e) => {
    let guess = e.target.closest(".answerBox");
    if (guess) { //Check to make sure one of answer boxes was clicked and not empty space
        checkMultipleChoiceCorrect(guess);
        disableDisplays();
    }
});

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











