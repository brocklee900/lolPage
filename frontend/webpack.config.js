
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
    mode: "development",
    entry: {
        index: "./src/index.js",
        champions: "./src/champions.js",
        quiz: "./src/quiz.js",
    },
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "dist"),
        clean: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            filename: "index.html",
            chunks: ["index"],
        }),
        new HtmlWebpackPlugin({
            template: "./src/champions.html",
            filename: "champions.html",
            chunks: ["champions"],
        }),
        new HtmlWebpackPlugin({
            template: "./src/quiz.html",
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