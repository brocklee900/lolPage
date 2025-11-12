
const fetch = require("node-fetch");
const baseUrl = "http://cdn.merakianalytics.com/riot/lol/resources/latest/en-US/champions"

function randInt(range) {
    let min = 0;
    let max = range-1;
    return Math.floor(Math.random() * (max-min+1)) + min;
}

async function getSplashUrl(req, res) {
    const { championName, num } = req.params;

    const response = await fetch(`${baseUrl}/${championName}.json`);
    const data = await response.json();
    const splash = data.skins[num].splashPath;
    res.send(splash);
}

async function getRandomSplashUrl(req, res) {
    const { championName } = req.params;

    const response = await fetch(`${baseUrl}/${championName}.json`);
    const data = await response.json();

    let num = randInt(data.skins.length);
    const splash = data.skins[num].splashPath;
    res.send(splash);
}

async function getLoadingSplashUrl(req, res) {
    const { championName, num } = req.params;

    const response = await fetch(`${baseUrl}/${championName}.json`);
    const data = await response.json();
    const loadingSplash = data.skins[num].loadScreenPath;
    res.send(loadingSplash);
}

module.exports = {
    getSplashUrl,
    getRandomSplashUrl,
    getLoadingSplashUrl
};