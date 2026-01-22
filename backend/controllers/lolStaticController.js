
const fetch = require("node-fetch");
const NodeCache = require("node-cache");
const cache = new NodeCache();

const baseUrl = "http://cdn.merakianalytics.com/riot/lol/resources/latest/en-US/champions"

function randInt(range) {
    let min = 0;
    let max = range-1;
    return Math.floor(Math.random() * (max-min+1)) + min;
}

function sendError(res, message="Something went wrong", status=500) {
    res.status(status).json({
        error:true,
        message
    });
}

async function timeoutTest() {
    return new Promise(resolve => setTimeout(resolve, 10000));
}

async function preloadChampions() {
    //await timeoutTest();
    const response = await fetch(`${baseUrl}.json`);
    const data = await response.json();

    if (!response.ok) {
        throw new Error("Server response error");
    }

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

        if (!response.ok) {
            throw new Error("Server response error");
        }

        const data = await response.json();
        return data;
    }
}

async function getSplashUrl(req, res) {

    const { championName, num } = req.params;
    try {
        const data = await getChampionData(championName);
        const splash = data.skins[num].splashPath;
        res.json({data: splash});
    } catch (error) {
        sendError(res, "Failed to get splash");
    }

}

async function getRandomSplashUrl(req, res) {
    const { championName } = req.params;

    try {
        const data = await getChampionData(championName);
        let num = randInt(data.skins.length);
        const splash = data.skins[num].splashPath;
        res.json({data: splash});
    } catch (error) {
        sendError(res, "Failed to get splash");
    }
}

async function getAllLoadingSplash(req, res) {
    if (cache.keys().length == 0) {
        try {
            await preloadChampions();
        } catch (error) {
            sendError(res, "Failed to preload cache");
        }
    }

    const data = {};
    cache.keys().forEach(key => {
        data[key] = cache.get(key).skins[0].loadScreenPath;
    });

    res.json(data);
}

async function getLoadingSplashUrl(req, res) {
    const { championName, num } = req.params;

    try {
        const data = await getChampionData(championName);
        const loadingSplash = data.skins[num].loadScreenPath;
        res.json({data: loadingSplash});
    } catch (error) {
        sendError(res, "Failed to get splash");
    }
}

async function getChampionIcon(req, res) {
    const { championName } = req.params;

    try {
        const data = await getChampionData(championName);
        const icon = data.icon;
        res.json({data: icon});
    } catch (error) {
        sendError(res, "Failed to get icon");
    }
}

async function getChampionAbility(req, res) {
    const {championName, key } = req.params;
    try {
        const data = await getChampionData(championName);
        const ability = data.abilities[key.toUpperCase()][0].name;
        res.json({data: ability});
    } catch (error) {
        sendError(res, "Failed to get ability name");
    }
}

module.exports = {
    preloadChampions,
    getSplashUrl,
    getRandomSplashUrl,
    getAllLoadingSplash,
    getLoadingSplashUrl,
    getChampionIcon,
    getChampionAbility,
};