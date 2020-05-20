const path=require("path");
const HtmlWebpackPlugin=require("html-webpack-plugin");

const join=(...args)=>path.join(__dirname,...args);

module.exports={
    mode:"development",
    entry:join("main.ts"),
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
    ],
    devServer:{
        port:8400
    }
};
