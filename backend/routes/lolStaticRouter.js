
const { Router } = require("express");
const { getSplashURL } = require("../controllers/lolStaticController");

const lolStaticRouter = Router();

lolStaticRouter.get("/champion/:championName", getSplashURL);
lolStaticRouter.get("/", (req, res) => res.send("championName"));

module.exports = lolStaticRouter;