
const { Router } = require("express");
const lolStaticController = require("../controllers/lolStaticController");

const lolStaticRouter = Router();

lolStaticRouter.get("/splash/random/:championName", lolStaticController.getRandomSplashUrl);
lolStaticRouter.get("/splash/:championName/:num", lolStaticController.getSplashUrl);
lolStaticRouter.get("/loadScreenSplash/all", lolStaticController.getAllLoadingSplash);
lolStaticRouter.get("/loadScreenSplash/:championName/:num", lolStaticController.getLoadingSplashUrl);
lolStaticRouter.get("/", (req, res) => res.send("championName"));

module.exports = lolStaticRouter;