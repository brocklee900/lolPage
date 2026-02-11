
require('dotenv').config();
const express = require("express");
const path = require("path");
const lolStaticRouter = require("./routes/lolStaticRouter");
const supabaseRouter = require("./routes/supabaseRouter");
const { preloadChampions } = require("./controllers/lolStaticController");


const app = express();

app.use("/lolStatic", lolStaticRouter);
app.use("/supabase", supabaseRouter);

//page routing
app.use(express.static(path.join(__dirname, "../frontend/dist"))); //loads index.html by default when page loads
app.get("/champions", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/champions.html"));
});

app.get("/quiz", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/quiz.html"));
});

app.get(/.*/, (req, res) => { //needs a regex for the catchall. Doesn't like "*"
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

//Before starting server, cache champion data collection
const PORT = 3000;
async function startServer() {
    try {
        await preloadChampions();

        app.listen(PORT, (error) => {
            if (error) {
                throw error;
            };

            console.log(`App listening on port ${PORT}`);
        });
    } catch (error) {
        console.log(error);
    }
}
startServer();


