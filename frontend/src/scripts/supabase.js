
async function fetchData(url) {

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        };

        return data;
    } catch (err) {
        console.log("ERROR MESSAGE: ", err.message);
        alert(err.message);
        return undefined;
    }
}

async function testSupabase(championName, num) {
    return await fetchData(`/supabase/champion/${championName}/emote/${num}`);
}

async function getQuestions(championName) {
    return await fetchData(`supabase/question/${championName}`);
}

async function getRandomQuestion(championName) {
    return await fetchData(`supabase/question/random/${championName}`);
}

export {testSupabase, getQuestions, getRandomQuestion};