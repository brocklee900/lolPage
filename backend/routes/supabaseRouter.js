
const { Router } = require("express");
const supabaseController = require("../controllers/supabaseController");

const supabaseRouter = Router();

supabaseRouter.get("/champion/:championName/emote/:num",
     supabaseController.getChampionEmote);
supabaseRouter.get("/question/:championName",
     supabaseController.getQuestions);
supabaseRouter.get("/question/random/:championName",
     supabaseController.getRandomQuestion);
supabaseRouter.get("/question/set/:championName/:num",
     supabaseController.getRandomQuestionSet);
supabaseRouter.get("/", (req, res) => res.send("Empty request to supabase"));

module.exports = supabaseRouter;