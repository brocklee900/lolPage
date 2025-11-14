
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
    mode: "development",
    entry: {
        index: "./src/pages/index/index.js",
        champions: "./src/pages/champions/champions.js",
        quiz: "./src/pages/quiz/quiz.js",
    },
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "dist"),
        clean: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/pages/index/index.html",
            filename: "index.html",
            chunks: ["index"],
        }),
        new HtmlWebpackPlugin({
            template: "./src/pages/champions/champions.html",
            filename: "champions.html",
            chunks: ["champions"],
        }),
        new HtmlWebpackPlugin({
            template: "./src/pages/quiz/quiz.html",
            filename: "quiz.html",
            chunks: ["quiz"],
        }),
    ],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
        ],
    },

}