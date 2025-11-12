
import "./index.css";

async function testLolStatic(championName) {
    const response = await fetch(`/lolStatic/champion/${championName}`);
    const data = await response.text();

    const img = document.querySelector(".splash");
    img.src = data;
}

testLolStatic("Zoe");