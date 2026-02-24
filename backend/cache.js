const fetch = require("node-fetch");
const NodeCache = require("node-cache");
const cache = new NodeCache();
const { createClient } = require('@supabase/supabase-js');
const secret = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET);

function compareVersion(versionA ,versionB) {
    versionA = versionA.split(".").map(Number);
    versionB = versionB.split(".").map(Number);

    const len = Math.max(versionA.length, versionB.length);
    for (let i = 0; i < len; i++) {
        const numA = versionA[i] || 0;
        const numB = versionB[i] || 0;
        if (numA > numB) return 1;
        if (numA < numB) return -1;
    }
    return 0; //both versions equal
}

async function storeCache(cache, patch) {
    const { data } = await secret
        .from("data_cache")
        .select("patch_number")
        .eq("id", 1)
        .single();
    
    if (compareVersion(patch, data.patch_number)) {
        console.log("UPDATING SUPABASE CACHE");
        await secret
            .from("data_cache")
            .upsert({
                id: 1,
                data: cache.mget(cache.keys()),
                patch_number: patch
            });
    }
}

async function retrieveCache() {
    const { data, error } = await secret
        .from("data_cache")
        .select("data, patch_number")
        .eq("id", 1)
        .single();
    console.log(`Retrieved data from Supabase. Version: ${data.patch_number}`);
    return data.data;
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

function getCacheKeysSorted() {
    return cache.keys().sort((a, b) => a.localeCompare(b)); //Sort before listing 1 by 1
}

function getChampionData(championName) {
    if (cache.keys().length != 0) {
        return cache.get(championName);
    } else {
        throw new Error("Failed to retrieve champion data");
    }
}

async function getChampionAbility(championName, key) {
    if (cache.keys().length != 0) {
        return cache.get(championName).abilities[key.toUpperCase()];
    } else {
        throw new Error("Failed to retrieve champion data");
    }
}

module.exports = {
    storeCache,
    retrieveCache,
    preloadChampions,
    getCacheKeysSorted,
    getChampionData,
    getChampionAbility,
}