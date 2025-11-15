
const fetch = require("node-fetch");
const NodeCache = require("node-cache");
const cache = new NodeCache();

const baseUrl = "http://cdn.merakianalytics.com/riot/lol/resources/latest/en-US/champions"

function randInt(range) {
    let min = 0;
    let max = range-1;
    return Math.floor(Math.random() * (max-min+1)) + min;
}

async function timeoutTest() {
    return new Promise(resolve => setTimeout(resolve, 10000));
}

async function preloadChampions() {
    //await timeoutTest();
    const response = await fetch(`${baseUrl}.json`);
    const data = await response.json();

    Object.keys(data).forEach(key => {
        cache.set(key, data[key]);
    });
}

async function getChampionData(championName) {
    if (cache.keys().length != 0) {
        console.log("data retrieved from cache");
        return cache.get(championName);
    } else {
        console.log("data retrieved from lolstatic api");
        const response = await fetch(`${baseUrl}/${championName}.json`);
        const data = await response.json();
        return data;
    }
}

async function getSplashUrl(req, res) {
    const { championName, num } = req.params;

    const data = await getChampionData(championName);
    const splash = data.skins[num].splashPath;
    res.json({data: splash});
}

async function getRandomSplashUrl(req, res) {
    const { championName } = req.params;

    const data = await getChampionData(championName);
    let num = randInt(data.skins.length);
    const splash = data.skins[num].splashPath;
    res.json({data: splash});
}

async function getAllLoadingSplash(req, res) {
    if (cache.keys().length == 0) {
        await preloadChampions();
    }

    const data = {};
    cache.keys().forEach(key => {
        data[key] = cache.get(key).skins[0].loadScreenPath;
    });

    res.json(data);
}

async function getLoadingSplashUrl(req, res) {
    const { championName, num } = req.params;

    const data = await getChampionData(championName);
    const loadingSplash = data.skins[num].loadScreenPath;
    res.json({data: loadingSplash});
}

async function getChampionIcon(req, res) {
    const { championName } = req.params;

    const data = await getChampionData(championName);
    const icon = data.icon;
    res.json({data: icon});
}

module.exports = {
    preloadChampions,
    getSplashUrl,
    getRandomSplashUrl,
    getAllLoadingSplash,
    getLoadingSplashUrl,
    getChampionIcon,
};