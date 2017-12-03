const Uglify = require("uglifyjs-webpack-plugin");
const path = require("path");
const webpack = require("webpack");

module.exports = env =>
{
	const config = {
		entry: path.resolve(__dirname, "scripts/entry.js"),
		output: {
			filename: "[name].bundle.js",
			path: path.resolve(__dirname, "public")
		},
		devtool: "#source-map",
		module: {
			loaders: [
				{ test: /\.jsx?$/, exclude: /node_modules/, loader: "babel-loader" },
				{ test: /\.less$/, exclude: /node_modules/, loader: "style-loader!css-loader!less-loader" }
			]
		},
		plugins: [
			// We only have one chunk, but we can fool this plugin into extracting anything from node_modules into a vendor chunk
			new webpack.optimize.CommonsChunkPlugin({
				name: 'vendor',
				minChunks: module => module.context && module.context.indexOf('node_modules') !== -1
			})
		]
	};

	if (env && env.production)
	{
		config.plugins.push(new webpack.DefinePlugin({
		  'process.env.NODE_ENV': JSON.stringify('production')
		}));
		config.plugins.push(new Uglify());
	}

	return config;
};
