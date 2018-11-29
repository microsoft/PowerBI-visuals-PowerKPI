const path = require('path');

const {
    config,
    getPowerBICustomVisualsWebpackPlugin,
} = require("./webpack.config.js");

config.plugins.push(getPowerBICustomVisualsWebpackPlugin(true));

config.watch = true;
config.mode = "development";
config.devtool = "inline-source.map";

config.devServer = {
    disableHostCheck: true,
    contentBase: [
        path.resolve(__dirname, "./.tmp/drop")
    ],
    compress: true,
    port: 8080,
    hot: false,
    inline: false,
    https: true,
    headers: {
        "access-control-allow-origin": "*",
        "cache-control": "public, max-age=0"
    }
};

delete config.optimization;

module.exports = config;
