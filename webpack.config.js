module.exports = 
{
    devtool: 'eval-source-map',
    entry:  __dirname + '/app/index.js',        //入口文件位置
    output: 
    {
        path: __dirname + '/dist',      //输出文件位置
        filename: 'bundle.js'       //输出文件名
    },
    devServer:
    {
        contentBase: './dist',      //本地服务器页面位置
        historyApiFallback: true,       //不跳转
        inline: true,        //实时刷新
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
    }
};