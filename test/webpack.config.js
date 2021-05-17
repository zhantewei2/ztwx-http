const path=require("path");
const HtmlWebpackPlugin=require("html-webpack-plugin");
const join=(...args)=>path.join(process.cwd(),...args);

module.exports={
    mode:env,
    devServer:{
        port:8080,
    },
    entry:join("test/main.ts"),
    output:{
        path:join("dist"),
        filename: "[name].js"
    },
    module:{
        rules: [
            {test:/\.ts$/,use:"ts-loader"}
        ]
    },
    resolve: {
        extensions: [".ts",".js"]
    },
    plugins:[
        new HtmlWebpackPlugin({})
    ]
};
