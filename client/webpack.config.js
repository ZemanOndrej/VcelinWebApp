let debug = process.env.NODE_ENV !== "production";
let webpack = require('webpack');
let path = require("path");



let APP_DIR = path.join(__dirname, "/src");

let config = {

    context: APP_DIR,
    devtool: debug ? "inline-sourcemap" : null,
    entry: "./js/scripts.js",
    watch: true,
    output: {
        path: APP_DIR + "/js",
        filename: "scripts.min.js"
    },
    plugins: debug ? [] : [
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({mangle: false, sourcemap: false}),
    ],
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015', 'stage-0'],
                    plugins: ['react-html-attrs', 'transform-decorators-legacy', 'transform-class-properties']
                }
            }
        ]
    }
};


module.exports= config;