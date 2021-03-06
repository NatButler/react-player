const { resolve } = require('path');

module.exports = env => ({
	entry: './src/main.jsx',
	output: {
		filename: 'app.js',
		path: resolve(__dirname, 'app/js'),
		pathinfo: !env.prod
	},
	bail: env.prod,
	resolve: {
    extensions: ['.js', '.jsx']
  },
  watch: true,
	module: {
		loaders: [
			{
				test: /\.(js|jsx)$/,
				exclude: /(node_modules|browser_components)/,
				loader: 'babel-loader'
			}
		]
	}
});