
const fetch = require("node-fetch");
const baseURL = "http://cdn.merakianalytics.com/riot/lol/resources/latest/en-US/champions"

async function getSplashURL(req, res) {
    const { championName } = req.params;

    const response = await fetch(`${baseURL}/${championName}.json`);
    const data = await response.json();
    const splash = data.skins[0].splashPath;
    res.send(splash);
}

module.exports = {getSplashURL};