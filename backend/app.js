
require('dotenv').config();
const express = require("express");
const path = require("path");
const lolStaticRouter = require("./routes/lolStaticRouter");
const supabaseRouter = require("./routes/supabaseRouter");


const app = express();

app.use("/lolStatic", lolStaticRouter);
app.use("/supabase", supabaseRouter);

app.use(express.static(path.join(__dirname, "../frontend")));
app.get(/.*/, (req, res) => { //needs a regex for the catchall. Doesn't like "*"
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

const PORT = 3000;
app.listen(PORT, (error) => {
    if (error) {
        throw error;
    };

    console.log(`App listening on port ${PORT}`);
});