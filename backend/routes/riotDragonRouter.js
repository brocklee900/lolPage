
const { Router } = require("express");
const riotDragonController = require("../controllers/riotDragonController");

const riotDragonRouter = Router();

riotDragonRouter.get("/splash/random/:championName", riotDragonController.getRandomSplashUrl);
riotDragonRouter.get("/splash/:championName/:num", riotDragonController.getSplashUrl);
riotDragonRouter.get("/loadScreenSplash/all", riotDragonController.getAllLoadingSplash);
riotDragonRouter.get("/loadScreenSplash/:championName/:num", riotDragonController.getLoadingSplashUrl);
riotDragonRouter.get("/icon/:championName", riotDragonController.getChampionIcon);
riotDragonRouter.get("/ability/:championName/:key", riotDragonController.getChampionAbility);
riotDragonRouter.get("/testError", (req, res) => {
    let status = 400;
    res.status(status).json({
        error: true,
        message: `TEST ERROR: ${status}`,
    });
});
riotDragonRouter.get("/", (req, res) => res.send("championName"));

module.exports = riotDragonRouter;