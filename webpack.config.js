const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const extractSass = new ExtractTextPlugin({
    filename: "styles.css",
    disable: process.env.NODE_ENV === "development"
});

module.exports = {
    entry: './src/App.js',
    output: {
        path: path.resolve(__dirname, "public"),
        filename: "bundle.js"
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
        extractSass
    ]
}