const path = require("path");

module.exports = {
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
	}
};
