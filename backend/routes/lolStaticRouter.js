
const { Router } = require("express");
const lolStaticController = require("../controllers/lolStaticController");

const lolStaticRouter = Router();

lolStaticRouter.get("/splash/:championName/:num", lolStaticController.getSplashURL);
lolStaticRouter.get("/loadScreenSplash/:championName/:num", lolStaticController.getLoadingSplashUrl);
lolStaticRouter.get("/", (req, res) => res.send("championName"));

module.exports = lolStaticRouter;