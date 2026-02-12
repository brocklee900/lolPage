
const { Router } = require("express");
const riotDragonController = require("../controllers/riotDragonController");

const riotDragonRouter = Router();

riotDragonRouter.get("/splash/random/:championName", riotDragonController.getRandomSplash);
riotDragonRouter.get("/splash/:championName/:num", riotDragonController.getSplash);
riotDragonRouter.get("/loading/all", riotDragonController.getAllLoading);
riotDragonRouter.get("/loading/random/:championName", riotDragonController.getRandomLoading);
riotDragonRouter.get("/loading/:championName/:num", riotDragonController.getLoading);
riotDragonRouter.get("/icon/all", riotDragonController.getAllChampionIcon);
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