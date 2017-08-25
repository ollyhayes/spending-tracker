module.exports = {
	entry: "./entry.js",
	output: {
		filename: "bundle.js",
	},
	devtool: "#source-map",
	module: {
		loaders: [
			{ test: /\.jsx$/, exclude: /node_modules/, loader: "babel-loader" },
			{ test: /\.less$/, exclude: /node_modules/, loader: "style-loader!css-loader!less-loader" }
		]
	}
};
