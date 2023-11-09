const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const webpack = require('webpack')

module.exports = {
    mode: 'development',
    devtool: 'cheap-module-source-map',
    devServer: {
        host: '0.0.0.0',
        port: 3000,
        hot: true,
        open: true,
        historyApiFallback: true,
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.name': JSON.stringify('Viswas'),
        }),
        new ReactRefreshPlugin(),
    ]
}