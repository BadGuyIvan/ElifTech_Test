const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

const extractSass = new ExtractTextPlugin({
    filename: "style.[chunkhash].css",
    disable: process.env.NODE_ENV === "development",
    allChunks: true
});

module.exports = {
    entry: './src/App.js',
    output: {
        path: path.resolve(__dirname, "public"),
        filename: "bundles.[chunkhash].js"
    },
    module:{
        rules:[
            {test: /\.js$/, use:"babel-loader", exclude: /node_modules/},
            {
                test: /\.scss$/,
                use: extractSass.extract({
                    use: [{
                        loader: "css-loader"
                    }, {
                        loader: "sass-loader"
                    }],
                    fallback: "style-loader"
                })
            }
        ]
    },
    plugins: [
        extractSass,
        new CleanWebpackPlugin('public/*.*', {watch: true} ),
        new HtmlWebpackPlugin({
            inject: false,
            hash: true,
            template: "./src/index.html",
            filename: 'index.html'
        })
    ]
}