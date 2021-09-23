// webpack.config.client.js
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    name: "client",
    entry: {
        client: path.resolve(__dirname, "src/client/client.tsx"),
    },
    mode: "production",
    output: {
        path: path.resolve(__dirname, "dist/static"),
        filename: "[name].[contenthash].js",
        publicPath: "",
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
    },
    target: "web",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                options: {
                    configFile: "tsconfig.client.json",
                },
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new WebpackManifestPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                { context: "src/client", from: "public", to: "assets" },
                { context: "src/server", from: "public", to: "assets" },
            ],
        }),
    ],
};
