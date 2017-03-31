var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'build');
var APP_DIR = path.resolve(__dirname, 'app');

var config;
config = {
    entry: APP_DIR + '/index.jsx',
    output: {
        path: BUILD_DIR,
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.jsx?/,
                exclude: path.resolve(__dirname, "node_modules"),
                include: APP_DIR,
                loader: 'babel-loader'
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                include: APP_DIR,
                loaders: [
                    'url-loader?limit=8192',
                    'img-loader'
                ]
            },
            // flexboxgrid
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader?modules',
                include: /flexboxgrid/,
            },
            {
                test: /\.scss$/,
                loaders: ['style-loader', 'css-loader', 'sass-loader']
            }
        ]
    }
};
module.exports = config;