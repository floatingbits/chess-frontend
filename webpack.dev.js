
var webpackMerge = require('webpack-merge');
var EnvironmentVariablesPlugin = require('environment-variables-webpack-plugin');
var commonConfig = require('./webpack.config.js');

module.exports = webpackMerge(commonConfig, {

    plugins: [
        new EnvironmentVariablesPlugin(
            {
                optionsFile: 'config/dev.json',
                chunks:['main'],
                skipUndefinedVars: false
            }
        )
    ]

});
