
import { getRandomQuestionSet } from "./supabase";


function createQuiz(name) {
    
    const championName = name;
    let questionSet;
    let currentQuestion = 0;
    let score = 0;

    async function createQuestionSet(numQuestions) {
        questionSet = await getRandomQuestionSet(championName, numQuestions);
        currentQuestion = 0;
    }

    function getNextQuestion() {
        if (questionSet && currentQuestion < questionSet.length) {
            let result = questionSet[currentQuestion];
            currentQuestion += 1;
            return result;
        }
        return undefined;
    }

    function addScore() {
        score += 1;
        console.log("Answered Correctly. +1 Score");
    }

    return {
        createQuestionSet, 
        getNextQuestion, 
        addScore,
        get score() {
            return score;
        },
    };
}   

export {createQuiz};
