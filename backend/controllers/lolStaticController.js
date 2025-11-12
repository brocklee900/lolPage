
const fetch = require("node-fetch");
const baseUrl = "http://cdn.merakianalytics.com/riot/lol/resources/latest/en-US/champions"

async function getSplashURL(req, res) {
    const { championName, num } = req.params;

    const response = await fetch(`${baseUrl}/${championName}.json`);
    const data = await response.json();
    const splash = data.skins[num].splashPath;
    res.send(splash);
}

async function getLoadingSplashUrl(req, res) {
    const { championName, num } = req.params;

    const response = await fetch(`${baseUrl}/${championName}.json`);
    const data = await response.json();
    const loadingSplash = data.skins[num].loadScreenPath;
    res.send(loadingSplash);
}

module.exports = {getSplashURL, getLoadingSplashUrl};