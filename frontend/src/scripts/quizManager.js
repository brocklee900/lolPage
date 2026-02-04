
import { getRandomQuestionSet } from "./supabase";


function createQuiz(name) {
    
    const championName = name;
    let questionSet;
    let currentQuestion = 0;
    let score = 0;
    
    const State = {
        INACTIVE: "INACTIVE",
        GUESSING: "GUESSING",
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
            quizState = State.GUESSING;
            return result;
        }
        quizState = State.INACTIVE
        return undefined;
    }

    function checkMultipleChoiceCorrect(guess) {
        quizState = State.WAIT_NEXT;
        const correct = (questionSet[currentQuestion-1].answers.find(a => a.is_correct)).answer_text;
        if (guess == correct) {
            return [true, correct]
        } else {
            return [false, correct]
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
