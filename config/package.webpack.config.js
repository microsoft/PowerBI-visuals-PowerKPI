const pathModule = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PowerBICustomVisualsWebpackPlugin = require('powerbi-visuals-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const powerbiVisualsApi = require('powerbi-visuals-api');

const package = require('../package.json');
const capabilities = require('../capabilities/capabilities.json');

function resolvePath(path) {
    return pathModule.resolve(__dirname, path);
}

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

const visualEntry = resolvePath('../src/visual.ts');

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

module.exports = {
    entry: {
        'visual.js': [visualEntry]
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
        path: resolvePath('../.tmp/drop'),
        publicPath: 'assets',
        filename: '[name]',
        library: `CustomVisual_${pbivizConfig.visual.guid}`,
    },
    plugins: [
        new MiniCssExtractPlugin({
            chunkFilename: '[id].css',
            filename: 'visual.css',
        }),
        new webpack.HashedModuleIdsPlugin(),
        new PowerBICustomVisualsWebpackPlugin({
            ...pbivizConfig,
            capabilities,
            devMode: false,
            packageOutPath: resolvePath('../dist'),
            stringResources: [],
            visualSourceLocation: visualEntry,
            apiVersion: powerbiVisualsApi.version,
            capabilitiesSchema: powerbiVisualsApi.schemas.capabilities,
            pbivizSchema: powerbiVisualsApi.schemas.pbiviz,
            stringResourcesSchema: powerbiVisualsApi.schemas.stringResources,
            dependenciesSchema: powerbiVisualsApi.schemas.dependencies,
        }),

    ]
};
