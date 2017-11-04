var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'build');
var APP_DIR = path.resolve(__dirname, 'app');

var config;
config = {
    context: APP_DIR,
    entry: APP_DIR + '/index.jsx',
    output: {
        path: BUILD_DIR,
        filename: 'bundle.js',
        publicPath: '/'
    },
    module: {
        loaders: [
            {
                test: /\.jsx?/,
                exclude: path.resolve(__dirname, "node_modules"),
                include: APP_DIR,
                loader: 'babel-loader',
                query: {
                    presets:['es2015','react']
                }
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                include: APP_DIR,
                loaders: [
                    'url-loader?limit=8192',
                    'img-loader'
                ]
            },
            {
                test: /\.html$/,
                loader: 'html-loader?attrs[]=video:src'
            },
            {
                test: /\.mp4$/,
                include: APP_DIR,
                loader: 'url?limit=10000&mimetype=video/mp4'
                //loader: 'url?limit=10000&mimetype=video/mp4'
            },
            // flexboxgrid
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader?modules',
                include: /flexboxgrid/,
            },
            // dazzle
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader?modules',
                include: /react-dazzle/,
            },
            {
                test: /\.scss$/,
                loaders: ['style-loader', 'css-loader', 'sass-loader']
            }
        ]
    }
};
module.exports = config;