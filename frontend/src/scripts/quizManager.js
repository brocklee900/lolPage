
import { getRandomQuestionSet } from "./supabase";
import { getQuestionData } from "./riotDragon";

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
        console.log("IN QUIZMANAGER", questionSet);
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
        guess = guess.replace(/[^a-z0-9]/gi, "").toLowerCase();
        quizState = State.WAIT_NEXT;
        
        const question = questionSet[currentQuestion-1];
        let answer = question.answers[0].answer_text;
        const strippedAnswer = answer.replace(/[^a-z0-9]/gi, "").toLowerCase();

        if (guess == strippedAnswer) {
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
