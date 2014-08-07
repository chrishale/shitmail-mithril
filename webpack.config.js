var path = require("path");
var webpack = require("webpack");

module.exports = {
    cache: true,
    entry: './src/main.js',
    debug: true,
    devtool: 'sourcemap',
    resolve: {
        modulesDirectories: ['node_modules', 'bower_components', './']
    },
    output: {
        path: './',
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            { test: /\.jsx$/, loader: "jsx-loader" }
        ]
    }
};