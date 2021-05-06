const { merge } = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.config');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const PATHS = {
	src: path.join(__dirname, './src'),
	dist: path.join(__dirname, './dist'),
	assets: 'assets/'
}
const buildWebpackConfig = merge(baseWebpackConfig, {
	mode: 'production',
	target: 'web',
	devServer: {
		port: 8081,
		hot: true,
		overlay: {
			warnings: true,
			errors: true
		}
	},
	module: {
		rules: [{
				test: /\.scss$/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
					{
						loader: 'postcss-loader',
						options: {
							sourceMap: true,
							postcssOptions: {	
								config: 'src/assets/js/postcss.config.js'
							}
						}
					},
					'sass-loader',
					{
						loader: 'sass-resources-loader',
						options: {
							// Provide path to the file with resources
							resources: [
								'src/assets/css/_bourbon.scss',
								'src/assets/css/fonts.scss',
								'src/assets/css/vars.scss'
							]
						}
					}
				]

			},
			{
				test: /\.css$/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
					{
						loader: 'postcss-loader',
						options: {
							sourceMap: true,
							postcssOptions: {
								config: './postcss.config.js'
							}
						}
					},
				]

			},
			{
				test: /\.(png|jpg|gif|svg)$/,
				loader: 'file-loader',
				options: {
					name: '[name].[ext]',
					outputPath: `${PATHS.assets}images/`,
					publicPath: "../images/"
				}
			},
			{
				test: /\.(woff|ttf|eot|otf)$/,
				loader: 'file-loader',
				options: {
					name: '[name].[ext]',
					outputPath: `${PATHS.assets}fonts/`,
					publicPath: "../fonts/"
				}
			}
		]
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: 'assets/css/[name].css',
		}),
	] 
})

module.exports = new Promise((resolve, reject) => {
	resolve(buildWebpackConfig)
})