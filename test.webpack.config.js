const path = require('path');
const webpack = require("webpack");

module.exports = {
    devtool: 'inline-source-map',
    mode: 'development',
    module: {
        rules: [{
                test: /\.ts$/,
                enforce: 'pre',
                exclude: /node_modules/,
                use: [{
                    loader: 'tslint-loader',
                    options: {
                        emitErrors: true,
                        fix: true
                    }
                }]
            },
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /(node_modules|dist|coverage|karma.conf.ts)/
            },
            {
                test: /\.ts$/i,
                enforce: 'post',
                include: /(src)/,
                exclude: /(specs|node_modules|resources\/js\/vendor)/,
                loader: 'istanbul-instrumenter-loader',
                options: {
                    esModules: true
                }
            },
            {
                test: /\.less$/,
                use: [{
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            paths: [path.resolve(__dirname, 'node_modules')]
                        }
                    }
                ]
            }
        ]
    },
    externals: {
        "powerbi-visuals-api": '{}'
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.css']
    },
    output: {
        path: path.resolve(__dirname, ".tmp"),
        filename: "specs.js"
    },
    plugins: [
        new webpack.ProvidePlugin({
            'powerbi-visuals-api': null
        }),
    ],
};
