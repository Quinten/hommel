'use strict';

const path = require('path');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const SimpleSW = require('simple-sw');

const config = require('./package');

module.exports = (env, argv) => {

    const devMode = argv.mode !== 'production';

    let webpackConfig = {

        entry: {
            'index': './src/index.js'
        },

        output: {
            path: path.resolve(__dirname, 'public'),
            publicPath: ''
        },

        module: {
            rules: [
                {
                    test: [ /\.vert$/, /\.frag$/ ],
                    use: 'raw-loader'
                },
                {
                    test: /\.js$/,
                    exclude: /node_modules/, // not really sur about this
                    use: {
                        loader: 'babel-loader'
                    }
                },
                {
                    test: /\.css$/,
                    use: [
                        'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 1,
                                modules: true
                            }
                        }
                    ],
                    include: /_.+\.css$/
                },
                {
                    test: /\.css$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader'
                    ],
                    exclude: /_.+\.css$/
                },
            ]
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: 'styles.css'
            }),
            new HtmlWebpackPlugin({
                ...config,
                template: './src/index.html'
            }),
            new FaviconsWebpackPlugin({
                logo: './src/icon.png',
                mode: 'webapp',
                devMode: 'webapp',
                prefix: '',
                favicons: {
                    path: '',
                    background: config.bgColor,
                    theme_color: config.bgColor,
                    appName: config.shortName,
                    appShortName: config.shortName,
                    appDescription: config.description,
                    developerName: config.author,
                    developerURL: config.homepage,
                    orientation: 'any',
                    scope: './',
                    start_url: './',
                    version: config.version,
                    icons: {
                        android: true,
                        coast: false,
                        yandex: false,
                        firefox: false,
                        windows: true,
                        appleIcon: true,
                        appleStartup: false,
                        favicons: true
                    }
                }
            })
        ],

        devServer: {
            contentBase: "./public",
            host: "0.0.0.0",
            port: 3000
        }
    }

    if (!devMode) {

        webpackConfig.optimization = {
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        output: {
                            comments: false
                        }
                    }
                })
            ]
        }

        webpackConfig.plugins.push(new SimpleSW( { version: config.version } ));
    }

    return webpackConfig;
};
