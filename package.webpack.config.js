const path = require('path');

const {
    config,
    getPowerBICustomVisualsWebpackPlugin,
} = require("./webpack.config.js");

const getPowerBICustomVisualsWebpackPlugin = require('./getPowerBICustomVisualsWebpackPlugin.js');

const visualEntry = path.resolve(__dirname, './src/visual.ts');

config.plugins.push(getPowerBICustomVisualsWebpackPlugin(false, visualEntry));

config.entry = {
    'visual.js': [visualEntry]
};

module.exports = config;
