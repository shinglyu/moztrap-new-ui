// webpack.config.js

var webpack = require("webpack");

var plugins, loaders, filename, locale = GLOBAL.__LOCALE__ || "en";

if(GLOBAL.__MODE__){

	//for develop BUILD_DEV=1 BUILD_PRERELEASE=1 webpack
	var definePlugin = new webpack.DefinePlugin({
	  __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || "true")),
	  __PRERELEASE__: JSON.stringify(JSON.parse(process.env.BUILD_PRERELEASE || "true")),
	  __LOCALE__: JSON.stringify(locale)
	});

	plugins = [definePlugin];

	loaders = [
		{
			test: /\.jsx$/,
			exclude: /node_modules/,
			loader: "babel-loader"
		}
	];

	filename = ["datepicker", locale, "js"];

} else {

	var definePlugin = new webpack.DefinePlugin({
	  __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || "false")),
	  __PRERELEASE__: JSON.stringify(JSON.parse(process.env.BUILD_PRERELEASE || "false")),
	  __LOCALE__: JSON.stringify(locale)
	});

	var uglifyPlugin = new webpack.optimize.UglifyJsPlugin({
		compress: {
	        warnings: false
	    }
	});

	plugins = [definePlugin, uglifyPlugin];

	loaders = [
		{
			test: /\.jsx$/,
			exclude: /node_modules/,
			loader: "babel-loader",
			query: {
				blacklist: ["strict"]
			}
		}
	];

	filename = ["datepicker", locale, "min", "js"];

}

module.exports = {
	entry: "./src/datepicker.jsx",
 	output: {
		filename: "./build/" + filename.join(".")       
	},
	module: {
		loaders: loaders
	},
	plugins: plugins
};