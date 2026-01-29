
import { getRandomQuestionSet } from "./supabase";


function createQuiz(name) {
    
    const championName = name;
    let questionSet;
    let currentQuestion = 0;

    async function createQuestionSet(numQuestions) {
        questionSet = await getRandomQuestionSet(championName, numQuestions);
        console.log(typeof(questionSet));
        currentQuestion = 0;
    }

    function getNextQuestion() {
        if (currentQuestion < questionSet.length) {
            let result = questionSet[currentQuestion];
            currentQuestion += 1;
            return result;
        }
        return undefined;
    }

    return {createQuestionSet, getNextQuestion};
}   

export {createQuiz};
