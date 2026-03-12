const { getChampionData, getCacheKeysSorted, getChampionDataByID } = require("../cache.js");

const platformToRegion = {
    na1: 'americas',
    br1: 'americas',
    la1: 'americas',
    la2: 'americas',
    oc1: 'americas',
    euw1: 'europe',
    eun1: 'europe',
    tr1: 'europe',
    ru: 'europe',
    kr: 'asia',
    jp1: 'asia',
};

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
    try {
        const data = {};
        const sortedKeys = getCacheKeysSorted();
        for (let key of sortedKeys) {
            data[key] = getChampionData(key).icon;
        };
        res.json(data);
    } catch (error) {
        sendError(res, "Failed to get all icons");
    }
}

async function getChampionIcon(req, res) {
    const { championName } = req.params;

    try {
        const data = getChampionData(championName);
        const icon = data.icon;
        res.json({data: icon});
    } catch (error) {
        sendError(res, "Failed to get icon");
    }
}

async function getChampionAbilityImage(req, res) {
    const { championName, key } = req.params;
    try {
        const data = getChampionData(championName);
        const image = data.abilities[key.toUpperCase()].icon;
        res.json({data: image});
    } catch (error) {
        sendError(res, "Failed to get ability image");
    }
}

async function getChampionAbilityName(req, res) {
    const { championName, key } = req.params;
    try {
        const data = getChampionData(championName);
        const ability = data.abilities[key.toUpperCase()].name;
        res.json({data: ability});
    } catch (error) {
        sendError(res, "Failed to get ability name");
    }
}

async function getAccountPUUID(req, res) {
    const { platform, gameName, tagLine } = req.params;
    const region = platformToRegion[platform];
    try {
        const response = await fetch(
            `https://${region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`,
            { headers: {'X-Riot-Token': process.env.RIOT_KEY}}
        );
        if (!response.ok) {
            throw new Error();
        }
        const data = await response.json();
        res.json({data: data.puuid});
    } catch (error) {
        sendError(res, "Failed Account Fetch");
    }
}

async function getTopMastery(req, res) {
    const { platform, puuid, num } = req.params;
    try {
        const response = await fetch(
            `https://${platform}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}/top?count=${num}`,
            { headers: {'X-Riot-Token': process.env.RIOT_KEY}}
        );
        if (!response.ok) {
            throw new Error();
        }
        const data = await response.json();
        const masteryData = new Array();
        for (let champion of data) {
            championData = await getChampionDataByID(champion.championId);
            masteryData.push({
                championName: championData.name,
                championID: championData.id,
                championLevel: champion.championLevel,
                championPoints: champion.championPoints
            });
        }
        res.json({data: masteryData});
    } catch (error) {
        sendError(res, "Failed Mastery Fetch");
    }
}

module.exports = {
    getSplash,
    getRandomSplash,
    getLoading,
    getRandomLoading,
    getChampionIcon,
    getAllChampionIcon,
    getChampionAbilityImage,
    getChampionAbilityName,
    getAccountPUUID,
    getTopMastery,
};