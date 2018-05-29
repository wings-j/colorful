const webpack=require('webpack');

module.exports = 
{
    entry:  __dirname + '/app/index.js',        //入口文件位置
    output: 
    {
        path: __dirname + '/dist-production',      //输出文件位置
        filename: 'bundle.js'       //输出文件名
    },
    module: 
    {
        rules: 
        [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query:
                {
                    presets:['react','es2015']
                }
            },
            {
                test: /\.(css|less)$/,
                use: ['style-loader','css-loader','less-loader']
            },
            {
                test:/\.png$/,
                loader:'file-loader',
                query:
                {
                    name:'./image/[name].[ext]',
                    limit:0
                }
            }
        ]
    },
    plugins: 
    [
        new webpack.DefinePlugin({'process.env.NODE_ENV': JSON.stringify('production')}),
        new webpack.optimize.UglifyJsPlugin()
    ]
};