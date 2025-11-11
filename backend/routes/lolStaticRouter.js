
const { Router } = require("express");
const lolStaticController = require("../controllers/lolStaticController");

const lolStaticRouter = Router();

lolStaticRouter.get("/champion/:championName", lolStaticController.getSplashURL);
lolStaticRouter.get("/", (req, res) => res.send("championName"));

module.exports = lolStaticRouter;