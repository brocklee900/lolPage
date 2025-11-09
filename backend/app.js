const express = require("express");
const app = express();
const lolStaticRouter = require("./routes/lolStaticRouter");

app.use("/lolStatic", lolStaticRouter);


const PORT = 3000;
app.listen(PORT, (error) => {
    if (error) {
        throw error;
    };

    console.log(`App listening on port ${PORT}`);
});