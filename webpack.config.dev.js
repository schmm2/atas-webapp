var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'build/');
var APP_DIR = path.resolve(__dirname, 'app/');

var config;
config = {
    devtool: 'eval',
    context: APP_DIR,
    entry: [
        'webpack-dev-server/client?http://localhost:8888',
        'webpack/hot/dev-server',
        APP_DIR + '/index.jsx'
    ],
    output: {
        path: BUILD_DIR,
        filename: 'bundle.js',
        publicPath: '/'
    },
    devServer: {
        inline: false,
        historyApiFallback: true,
        contentBase: BUILD_DIR,
        hot: true,
        compress: true,
        port: 8888
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
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