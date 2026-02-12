
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

async function getSplashUrl(championName, num) {

    return await fetchData(`/riotDragon/splash/${championName}/${num}`);
}

async function getRandomSplashUrl(championName) {
    return await fetchData(`/riotDragon/splash/random/${championName}`);
}

async function getAllLoadingSplash() {

    return await fetchData(`/riotDragon/loadScreenSplash/all`);
}

async function getLoadingSplashUrl(championName, num) {
    
    return await fetchData(`/riotDragon/loadScreenSplash/${championName}/${num}`);
}

async function getChampionIcon(championName) {

    return await fetchData(`/riotDragon/icon/${championName}`);
}

async function getAnswerData(url) {
    return await fetchData(url);
}


export {
    getSplashUrl,
    getRandomSplashUrl,
    getAllLoadingSplash,
    getLoadingSplashUrl,
    getChampionIcon,
    getAnswerData,
};