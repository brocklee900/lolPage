
const fetch = require("node-fetch");
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function getChampionEmote(req, res) {
    const {championName, num} = req.params;

    const {data} = await supabase
        .storage
        .from('LoLGifs')
        .getPublicUrl(`${championName}/LoL${championName}Emote${num}.mp4`);

    res.send(data);
}

async function getQuestion(req, res) {
    const {championName} = req.params;

    const {data, error} = await supabase
        .from('questions')
        .select(
            `question_text,
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

    res.json(data);
}

module.exports = {
    getChampionEmote,
    getQuestion,
    
};