
async function testAPI(championName) {
    const response = await fetch(`/lolStatic/champion/${championName}`);
    const data = await response.text();

    const img = document.querySelector(".splash");
    img.src = data;
}

testAPI("Zoe");