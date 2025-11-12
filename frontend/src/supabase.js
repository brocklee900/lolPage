

async function testSupabase(championName, num) {
    const response = await fetch(`/supabase/champion/${championName}/emote/${num}`);
    const data = await response.json();

    return data.publicUrl;
}

export {testSupabase};