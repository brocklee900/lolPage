
const { Router } = require("express");

const lolStaticRouter = Router();

lolStaticRouter.get("/:championName", (req, res) => {
    const {championName} = req.params;
    res.send(`Champion: ${championName}`);
});
lolStaticRouter.get("/", (req, res) => res.send("championName"));

module.exports = lolStaticRouter;