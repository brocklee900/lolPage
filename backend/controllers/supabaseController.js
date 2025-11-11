
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

module.exports = {getChampionEmote};