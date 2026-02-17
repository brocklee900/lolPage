
import { getRandomQuestionSet } from "./supabase";
import { getAnswerData } from "./riotDragon";


function createQuiz(name) {
    
    const championName = name;
    let questionSet;
    let currentQuestion = 0;
    let score = 0;
    
    const State = {
        INACTIVE: "INACTIVE",
        MULTIPLEQUESTION: "MULTIPLEQUESTION",
        FILLQUESTION: "FILLQUESTION",
        WAIT_NEXT: "WAIT_NEXT",
    }

    let quizState = State.INACTIVE;

    async function createQuestionSet(numQuestions) {
        questionSet = await getRandomQuestionSet(championName, numQuestions);
        currentQuestion = 0;
        quizState = State.INACTIVE;
    }

    function getNextQuestion() {
        if (questionSet && currentQuestion < questionSet.length) {
            let result = questionSet[currentQuestion];
            currentQuestion += 1;
            if (result.question_type == "multiple") {
                quizState = State.MULTIPLEQUESTION;
            } else {
                quizState = State.FILLQUESTION;
            }
            return result;
        }
        quizState = State.INACTIVE
        return undefined;
    }

    function checkMultipleChoiceCorrect(guess) {
        quizState = State.WAIT_NEXT;
        const correct = (questionSet[currentQuestion-1].answers
            .find(a => a.is_correct)).answer_text;
        if (guess == correct) {
            addScore();
            return [true, correct]
        } else {
            return [false, correct]
        }
    }

    async function checkFillBlankCorrect(guess) {
        quizState = State.WAIT_NEXT;
        guess = guess.replace(/\s+/g, "").toLowerCase();
        quizState = State.WAIT_NEXT;
        let answer;
        const question = questionSet[currentQuestion-1];
        if (question.answer_source == "api") {
            const url = question.answer_endpoint.replace("{championName}", championName);
            answer = (await getAnswerData(url)).data;
        } else { //question.answer_source == "database"
            answer = question.answers[0].answer_text;
        }
        answer = answer.replace(/\s+/g, "").toLowerCase();

        if (guess == answer) {
            addScore();
            return [true, answer];
        } else {
            return [false, answer];
        }
    }

    function addScore() {
        score += 1;
        console.log("Answered Correctly. +1 Score");
    }

    function checkQuizEnd() {
        return (currentQuestion >= questionSet.length);
    }

    return {
        createQuestionSet, 
        getNextQuestion, 
        checkMultipleChoiceCorrect,
        checkFillBlankCorrect,
        addScore,
        checkQuizEnd,
        get score() {
            return score;
        },
        get quizState() {
            return quizState;
        },
    };
}   

export {createQuiz};
