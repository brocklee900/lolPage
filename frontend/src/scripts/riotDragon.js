
async function fetchData(url) {

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        };

        return data;
    } catch (err) {
        console.log("ERROR MESSAGE: ", err.message);
        alert(err.message);
        return undefined;
    }
}

async function getSplash(championName, num) {

    return await fetchData(`/riotDragon/splash/${championName}/${num}`);
}

async function getRandomSplash(championName) {
    return await fetchData(`/riotDragon/splash/random/${championName}`);
}

async function getAllLoading() {

    return await fetchData(`/riotDragon/loading/all`);
}

async function getLoading(championName, num) {
    
    return await fetchData(`/riotDragon/loading/${championName}/${num}`);
}

async function getRandomLoading(championName) {
    return await fetchData(`/riotDragon/loading/random/${championName}`);
}

async function getChampionIcon(championName) {

    return await fetchData(`/riotDragon/icon/${championName}`);
}

async function getAllChampionIcon() {
    return await fetchData(`/riotDragon/icon/all`);
}

async function getQuestionData(url) {
    return await fetchData(url);
}

async function getAccountPUUID(region, gameName, tagLine) {
    return await fetchData(`/riotDragon/account/puuid/${region}/${gameName}/${tagLine}`);
}

async function getTopMastery(region, gameName, tagLine, num) {
    const puuid = (await getAccountPUUID(region, gameName, tagLine)).data;
    const masteries = (await fetchData(`/riotDragon/account/mastery/top/${"na1"}/${puuid}/${num}`)).data;
    return masteries;
}

export {
    getSplash,
    getRandomSplash,
    getAllLoading,
    getLoading,
    getRandomLoading,
    getChampionIcon,
    getAllChampionIcon,
    getQuestionData,
    getTopMastery,
};