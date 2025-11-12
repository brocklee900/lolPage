
async function getSplashUrl(championName, num) {
    const response = await fetch(`/lolStatic/splash/${championName}/${num}`);
    const data = await response.text();

    return data;
}

async function getRandomSplashUrl(championName) {
    const response = await fetch(`/lolStatic/splash/random/${championName}`);
    const data = await response.text();

    return data;
}

async function getLoadingSplashUrl(championName, num) {
    const response = await fetch(`/lolStatic/loadScreenSplash/${championName}/${num}`);
    const data = await response.text();

    return data;
}


export {
    getSplashUrl,
    getRandomSplashUrl,
    getLoadingSplashUrl
};