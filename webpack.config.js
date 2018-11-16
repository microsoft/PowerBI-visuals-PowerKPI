const pathModule = require('path');
const webpack = require('webpack');
const powerbiVisualsApi = require('powerbi-visuals-api');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PowerBICustomVisualsWebpackPlugin = require('powerbi-visuals-webpack-plugin');

const pluginLocation = resolvePath('.tmp/precompile/visualPlugin.ts');
const capabilities = require('./capabilities.json');
const package = require('./package.json');

function resolvePath(path) {
    return pathModule.resolve(__dirname, path);
}

const babelLoader = {
    loader: 'babel-loader',
    options: {
        presets: [
            [
                '@babel/preset-env',
                {
                    "targets": {
                        "ie": "11"
                    }
                }
            ]
        ]
    }
};

const pbivizConfig = {
    author: {
        ...package.author,
    },
    assets: {
        icon: './assets/icon.png'
    },
    visual: {
        ...package.visual,
        displayName: `${package.visual.displayName} ${package.version}`,
        gitHubUrl: package.homepage,
        version: package.version,
        description: package.description,
    },
};

function getPowerBICustomVisualsWebpackPlugin(devMode) {
    return new PowerBICustomVisualsWebpackPlugin({
        ...pbivizConfig,
        capabilities,
        devMode,
        packageOutPath: resolvePath('dist'),
        stringResources: [],
        visualSourceLocation: '../../src/visual.ts',
        apiVersion: powerbiVisualsApi.version,
        capabilitiesSchema: powerbiVisualsApi.schemas.capabilities,
        pbivizSchema: powerbiVisualsApi.schemas.pbiviz,
        stringResourcesSchema: powerbiVisualsApi.schemas.stringResources,
        dependenciesSchema: powerbiVisualsApi.schemas.dependencies,
    });
}

const config = {
    entry: {
        'visual.js': [pluginLocation]
    },
    mode: 'production',
    module: {
        rules: [{
                parser: {
                    amd: false
                }
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: [
                    babelLoader,
                    {
                        loader: 'ts-loader',
                        options: {
                            configFile: resolvePath('./tsconfig.json'),
                        }
                    },
                ],
            },
            {
                test: /\.js$/,
                include: /powerbi-visuals-utils-/,
                use: babelLoader,
            },
            {
                test: /\.less$/,
                use: [{
                        loader: MiniCssExtractPlugin.loader
                    },
                    {
                        loader: 'css-loader',
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            paths: [resolvePath('./node_modules')]
                        }
                    }
                ]
            }
        ]
    },
    externals: {
        'powerbi-visuals-api': 'null',
        'fakeDefine': 'false'
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.css']
    },
    output: {
        path: resolvePath('./.tmp/drop'),
        publicPath: 'assets',
        filename: '[name]',
        library: `CustomVisual_${package.visual.guid}`,
    },
    plugins: [
        new webpack.WatchIgnorePlugin([pluginLocation]),
        new MiniCssExtractPlugin({
            chunkFilename: '[id].css',
            filename: 'visual.css',
        }),
        new webpack.HashedModuleIdsPlugin(),
    ]
};

module.exports = {
    getPowerBICustomVisualsWebpackPlugin,
    config,
};
