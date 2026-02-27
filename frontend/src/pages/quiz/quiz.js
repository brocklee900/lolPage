import "./quiz.css";
import { getChampionIcon, getLoading, getRandomLoading, getQuestionData } from "../../scripts/riotDragon";
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

function createAnswerBox(answerText) {
    const answerDisplay = document.querySelector('#answerDisplay');
    let div = document.createElement('div');
    div.classList.add("answerBox");
    let text = document.createElement('p');
    text.textContent = answerText;
    div.appendChild(text);
    answerDisplay.appendChild(div);
}

async function displayVisualData(visualData) {
    if (visualData) {
        const questionDisplay = document.querySelector('#questionDisplay');
        const img = document.createElement("img")
        img.classList.add("visualData");
        img.src = visualData;
        questionDisplay.appendChild(img);
    }
}

async function displayQuestion(questionData) {
    const qText = document.querySelector('#questionDisplay p');
    const inputBox = document.querySelector('input#inputBox');
    document.querySelector('#questionDisplay').replaceChildren(qText);
    document.querySelector('#answerDisplay').replaceChildren(inputBox);

    qText.textContent = questionData.question_text.replace("{championName}", championName);

    if (questionData.question_type == 'multiple') {
        console.log("MULTIPLE CHOICE QUESTION");
        console.log("PULL ANSWER FROM SUPABASE");
        for (const answer of questionData.answers) {
            createAnswerBox(answer.answer_text);
        }
    } else { //question_type == 'fill'
        console.log("FILL IN BLANK QUESTION");
    }

    displayVisualData(questionData.visual_data)
}

function checkMultipleChoiceCorrect(guess) {
    const answer_text = guess.querySelector("p").textContent
    const [result, correctAnswer] = quizManager.checkMultipleChoiceCorrect(answer_text);
    if (result) {
        guess.classList.add("true");
    } else {
        guess.classList.add("false");
        let answers = [...document.querySelector("div#answerDisplay")
            .querySelectorAll(":scope > div")]; //exclude inputbox
        let correctDiv = answers.find(a => a.querySelector("p").textContent == correctAnswer);
        correctDiv.classList.add("true");
    }
}

async function checkFillBlankCorrect() {
    const inputBox = document.querySelector("input#inputBox");
    const [result, correctAnswer] = await quizManager.checkFillBlankCorrect(inputBox.value);
    if (result) {
        inputBox.classList.add("true");
    } else {
        inputBox.classList.add("false");
        const answerDisplay = document.querySelector("div#answerDisplay");
        const p = document.createElement("p");
        p.textContent = `Answer: "${correctAnswer}"`;
        answerDisplay.appendChild(p);
    }
}

function disableDisplays() {
    const quizState = quizManager.quizState;

    const startBtn = document.querySelector("button#start");
    const nextBtn = document.querySelector("button#next");
    const submitBtn = document.querySelector("button#submit");
    const answerDisplay = document.querySelector("div#answerDisplay");
    const inputBox = document.querySelector("#inputBox");
    inputBox.blur();
    switch (quizState) {
        case ("INACTIVE"):
            startBtn.classList.remove("disabled");
            nextBtn.classList.add("disabled");
            submitBtn.classList.add("disabled");
            answerDisplay.classList.add("disabled");
            inputBox.classList.add("disabled");
            break;
        case ("MULTIPLEQUESTION"):
            startBtn.classList.add("disabled");
            nextBtn.classList.add("disabled");
            submitBtn.classList.add("disabled");
            answerDisplay.classList.remove("disabled");
            inputBox.classList.add("disabled");
            break;
        case ("FILLQUESTION"):
            startBtn.classList.add("disabled");
            nextBtn.classList.add("disabled");
            submitBtn.classList.remove("disabled");
            answerDisplay.classList.remove("disabled");
            inputBox.classList.remove("disabled", "inactive", "true", "false");
            inputBox.value = "";
            inputBox.focus();
            break;
        case ("WAIT_NEXT"):
            startBtn.classList.add("disabled");
            nextBtn.classList.remove("disabled");
            submitBtn.classList.add("disabled");
            answerDisplay.classList.add("disabled");
            inputBox.classList.add("inactive");
            break;
    }
}

const NUM_QUESTIONS = 5;
document.querySelector("button#start").addEventListener("click", async (e) => {
    await quizManager.createQuestionSet(NUM_QUESTIONS);
    displayQuestion(quizManager.getNextQuestion());
    disableDisplays();
});

document.querySelector("button#submit").addEventListener("click", async (e) => {
    await checkFillBlankCorrect();
    disableDisplays();
});

document.querySelector("input#inputBox").addEventListener("keyup", async (e) => {
    if (quizManager.quizState == "FILLQUESTION" && e.key == "Enter") {
        await checkFillBlankCorrect();
        disableDisplays();
    }
});

document.querySelector("button#next").addEventListener("click", (e) => {
    let question = quizManager.getNextQuestion();
    if (question) {
        displayQuestion(question);
        disableDisplays();
    } else {
        let score = document.createElement("p");
        score.textContent = `Score: ${quizManager.score}/${NUM_QUESTIONS}`;
        const input = document.querySelector("input#inputBox");
        document.querySelector("div#answerDisplay").replaceChildren(score, input);
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

const icon = document.querySelector("img#icon");
let data = await getChampionIcon(championName);
if (data) {
    icon.src = data.data; //data exists
} else {
    icon.src = data; //data doesn't exist, set to error
}
icon.onerror = createPlaceholder;

const defaultSkin = document.querySelector("div#defaultSkin img");
data = await getLoading(championName, 0);
defaultSkin.src = data.data;
const randomSkin = document.querySelector("div#randomSkin img");
data = await getRandomLoading(championName);
while (data.data == defaultSkin.src) {
    data = await getRandomLoading(championName);
}
randomSkin.src = data.data;

const body = document.querySelector("body");
const video = document.createElement("video");
const videodata = await testSupabase(championName, 1);
video.src = videodata.publicUrl;
video.onerror = createPlaceholder;
video.autoplay = true;
video.loop = true;
video.muted = true;
video.classList.add("gif");
body.appendChild(video);











