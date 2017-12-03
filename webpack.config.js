const Uglify = require("uglifyjs-webpack-plugin");
const path = require("path");

module.exports = env =>
{
	const config = {
		entry: path.resolve(__dirname, "scripts/entry.js"),
		output: {
			filename: "bundle.js",
			path: path.resolve(__dirname, "public")
		},
		devtool: "#source-map",
		module: {
			loaders: [
				{ test: /\.jsx?$/, exclude: /node_modules/, loader: "babel-loader" },
				{ test: /\.less$/, exclude: /node_modules/, loader: "style-loader!css-loader!less-loader" }
			]
		},
		plugins: []
	};

	if (env && env.production)
		config.plugins.push(new Uglify());

	return config;
};
