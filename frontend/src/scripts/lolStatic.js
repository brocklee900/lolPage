
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

    return await fetchData(`/lolStatic/splash/${championName}/${num}`);
}

async function getRandomSplashUrl(championName) {
    return await fetchData(`/lolStatic/splash/random/${championName}`);
}

async function getAllLoadingSplash() {

    return await fetchData(`/lolStatic/loadScreenSplash/all`);
}

async function getLoadingSplashUrl(championName, num) {
    
    return await fetchData(`/lolStatic/loadScreenSplash/${championName}/${num}`);
}

async function getChampionIcon(championName) {

    return await fetchData(`/lolStatic/icon/${championName}`);
}

async function getData(championName, url) {
    console.log(url);
}


export {
    getSplashUrl,
    getRandomSplashUrl,
    getAllLoadingSplash,
    getLoadingSplashUrl,
    getChampionIcon,
    getData,
};