
async function testLolStatic(championName) {
    const response = await fetch(`/lolStatic/champion/${championName}`);
    const data = await response.text();

    const img = document.querySelector(".splash");
    img.src = data;
}

testLolStatic("Zoe");

async function testSupabase(championName, num) {
    const response = await fetch(`/supabase/champion/${championName}/emote/${num}`);
    const data = await response.json();

    const video = document.querySelector(".gif");
    video.src = data.publicUrl;
}

testSupabase("Aatrox", 4);