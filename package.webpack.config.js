const {
    config,
    getPowerBICustomVisualsWebpackPlugin,
} = require("./webpack.config.js");

config.plugins.push(getPowerBICustomVisualsWebpackPlugin(false));

module.exports = config;
