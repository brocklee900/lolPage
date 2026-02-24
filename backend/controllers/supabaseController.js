
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const { getChampionAbility } = require("../cache.js");

const randInt = (length) => {
    return Math.floor(Math.random() * (length));
}

async function getChampionEmote(req, res) {
    const {championName, num} = req.params;

    const {data} = await supabase
        .storage
        .from('LoLGifs')
        .getPublicUrl(`${championName}/LoL${championName}Emote${num}.mp4`);

    res.send(data);
}

async function queryQuestions(championName) {
    const {data: dataNamed, error: errorNamed } = await supabase
        .from('questions')
        .select(
            `question_text,
            question_type,
            answer_source,
            visual_data,
            config,
            champions!inner(
                champion_name
            ),
            answers(
                id,
                answer_text,
                is_correct
            )`
        )
        .eq('champions.champion_name', championName);
    
    const {data: dataGeneral, error: errorGeneral} = await supabase
        .from('questions')
        .select(
            `question_text,
            question_type,
            answer_source,
            visual_data,
            config,
            champions(
                champion_name
            ),
            answers(
                id,
                answer_text,
                is_correct
            )`
        )
        .is('champion_id', null);
    
    return [...dataNamed, ...dataGeneral];
}

async function retrieveQuestionData(question, championName) {
    switch (question.answer_source) {
        case "static":
            break
        case "ability":
            const { ability_key } = question.config;
            const ability = await getChampionAbility(championName, ability_key);
            question.answers.push({id:0, is_correct: true, answer_text: ability.name});
            question.visual_data = ability.icon;
    }
}

function randomSet(data, n) {
    const used = new Set();
    const result = [];

    while (result.length < n && result.length < data.length) {
        const i = randInt(data.length);
        if (!used.has(i)) {
            used.add(i);
            result.push(data[i]);
        }
    }
    return result;
}

async function getQuestions(req, res) {
    const {championName} = req.params;
    const data = await queryQuestions(championName);
    res.json(data);
}

async function getRandomQuestion(req, res) {
    const {championName} = req.params;
    const data = await queryQuestions(championName);
    res.json(data[randInt(data.length)]);
}

async function getRandomQuestionSet(req, res) {
    const {championName, num} = req.params;
    const data = await queryQuestions(championName);
    let questionSet = randomSet(data, num);
    for (let question of questionSet) {
        console.log("BEFORE", question);
        await retrieveQuestionData(question, championName);
        console.log("AFTER", question);
    }
    res.json(questionSet);
}

module.exports = {
    getChampionEmote,
    getQuestions,
    getRandomQuestion,
    getRandomQuestionSet,
};