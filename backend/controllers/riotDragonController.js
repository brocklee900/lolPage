const { getChampionData } = require("../cache.js");

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

async function getSplash(req, res) {

    const { championName, num } = req.params;
    try {
        const data = await getChampionData(championName);
        const splash = data.skins[num].splash;
        res.json({data: splash});
    } catch (error) {
        sendError(res, "Failed to get splash");
    }
}

async function getRandomSplash(req, res) {
    const { championName } = req.params;

    try {
        const data = await getChampionData(championName);
        let num = randInt(Object.keys(data.skins).length);
        const splash = data.skins[num].splash;
        res.json({data: splash});
    } catch (error) {
        sendError(res, "Failed to get splash");
    }
}

async function getAllLoading(req, res) {
    if (cache.keys().length != 0) {
        const data = {};
        cache.keys().forEach(key => {
            data[key] = cache.get(key).skins[0].loading;
        });

        res.json(data);
    } else {
        throw new Error("Failed to get all splash");
    }
}

async function getLoading(req, res) {
    const { championName, num } = req.params;
    try {
        const data = await getChampionData(championName);
        const loading = data.skins[num].loading;
        res.json({data: loading});
    } catch (error) {
        sendError(res, "Failed to get loading");
    }
}

async function getRandomLoading(req, res) {
    const { championName } = req.params;
    try {
        const data = await getChampionData(championName);
        let num = randInt(Object.keys(data.skins).length);
        const loading = data.skins[num].loading;
        res.json({data: loading});
    } catch (error) {
        sendError(res, "Failed to get random loading");
    }
}

async function getAllChampionIcon(req, res) {
    if (cache.keys().length != 0) {
        const data = {};
        const sortedKeys = cache.keys().sort((a, b) => a.localeCompare(b)); //Sort before listing 1 by 1
        sortedKeys.forEach(key => {
            data[key] = cache.get(key).icon;
        });
        res.json(data);
    } else {
        throw new Error("Failed to get all icon");
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

async function getChampionAbilityImage(req, res) {
    const { championName, key } = req.params;
    try {
        const data = await getChampionData(championName);
        const image = data.abilities[key.toUpperCase()].icon;
        res.json({data: image});
    } catch (error) {
        sendError(res, "Failed to get ability image");
    }
}

async function getChampionAbilityName(req, res) {
    const { championName, key } = req.params;
    try {
        const data = await getChampionData(championName);
        const ability = data.abilities[key.toUpperCase()].name;
        res.json({data: ability});
    } catch (error) {
        sendError(res, "Failed to get ability name");
    }
}

module.exports = {
    getSplash,
    getRandomSplash,
    getAllLoading,
    getLoading,
    getRandomLoading,
    getChampionIcon,
    getAllChampionIcon,
    getChampionAbilityImage,
    getChampionAbilityName,
};