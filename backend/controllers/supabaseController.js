
const fetch = require("node-fetch");
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const secret = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET);

const randInt = (length) => {
    return Math.floor(Math.random() * (length));
}

async function storeCache(cache, patch) {
    const { data } = await secret
        .from("data_cache")
        .select("patch_number")
        .eq("id", 1)
        .single();
    
    if (data.patch_number < patch) {
        console.log('update');
        await secret
            .from("data_cache")
            .upsert({
                id: 1,
                data: cache.mget(cache.keys()),
                patch_number: patch
            });
    }
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
            answer_endpoint,
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
            answer_endpoint,
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
    res.json(randomSet(data, num));
}

module.exports = {
    storeCache,
    getChampionEmote,
    getQuestions,
    getRandomQuestion,
    getRandomQuestionSet,
};