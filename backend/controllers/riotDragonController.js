
const fetch = require("node-fetch");
const NodeCache = require("node-cache");
const cache = new NodeCache();
const {storeCache, retrieveCache} = require("./supabaseController");


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

async function getLatestPatch() {
    const response = await fetch(`https://ddragon.leagueoflegends.com/api/versions.json`);
    if (!response.ok) {
        throw new Error("Server response error");
    }
    return (await response.json())[0];
}

function getAbilities(data, patch) {
    let abilities = {};
    abilities['P'] = {
        name: data.passive.name,
        icon: `https://ddragon.leagueoflegends.com/cdn/${patch}/img/passive/${data.passive.image.full}`,
    };

    for (let ability of data.spells) {
        abilities[ability.id.slice(-1)] = {
            name: ability.name,
            icon: `https://ddragon.leagueoflegends.com/cdn/${patch}/img/spell/${ability.id}.png`,
        };
    };
    return abilities;
}

function getSkins(data) {
    let skins = {};
    let count = 0;
    for (let skin of data.skins) {
        skins[count] = {
            name: skin.name,
            splash: `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${data.id}_${skin.num}.jpg`,
            loading: `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${data.id}_${skin.num}.jpg`,
        };
        count += 1;
    };
    return skins;
}

async function getChampionDataDragon(championID, patch) {
    const response = await fetch(`https://ddragon.leagueoflegends.com/cdn/${patch}/data/en_US/champion/${championID}.json`);
    if (!response.ok) {
        throw new Error("Server response error");
    }
    return (await response.json()).data[championID];
}

async function preloadChampions() {
    const currentPatch = await getLatestPatch();
    //retrieve collection of champions
    try {
        const response = await fetch(`https://ddragon.leagueoflegends.com/cdn/${currentPatch}/data/en_US/champion.json`);
        if (!response.ok) {
            throw new Error("Failed to fetch");
        }
        const championCollection = await response.json();

        for (let champion of Object.keys(championCollection.data)) {
            const generalData = championCollection.data[champion];
            const detailedData = await getChampionDataDragon(generalData.id, currentPatch);

            cache.set(generalData.id, {
                title: generalData.title,
                blurb: generalData.blurb,
                icon: `https://ddragon.leagueoflegends.com/cdn/${currentPatch}/img/champion/${generalData.id}.png`,
                skins: getSkins(detailedData),
                abilities: getAbilities(detailedData, currentPatch),
            });
        };
        storeCache(cache, currentPatch);
        console.log("Successfully preload from Riot Dragon");
        return;
    } catch (error) {
        console.log(`ERROR: ${error}`);
        console.log("Failed preoad from Riot Dragon");
    }
    console.log("Start preload from supabase");
    const data = await retrieveCache();
    cache.mset(Object.entries(data).map(([key, value]) => ({
        key,
        val: value
    })));
}

async function getChampionData(championName) {
    if (cache.keys().length != 0) {
        return cache.get(championName);
    } else {
        throw new Error("Failed to retrieve data");
    }
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

async function getChampionAbility(req, res) {
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
    preloadChampions,
    getSplash,
    getRandomSplash,
    getAllLoading,
    getLoading,
    getRandomLoading,
    getChampionIcon,
    getAllChampionIcon,
    getChampionAbilityImage,
    getChampionAbility,
};