
async function testAPI(championName) {
    const response = await fetch(`/lolStatic/${championName}`);
    console.log(response);
    const data = await response.text();
    console.log(data);
}

testAPI("Aatrox");