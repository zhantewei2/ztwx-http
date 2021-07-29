const path=require("path");
const join=(...args)=>path.join(process.cwd(),...args);

const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports={
    mode:"development",
    devServer:{
        port:8080,
    },
    entry:join("test/main.ts"),
    output:{
        clean: true,
        path:join("dist"),
        filename: "[name].js"
    },
    module:{
        rules: [
            {
                test:/\.ts$/,
                use: [
                   {
                        loader: "babel-loader",
                        options:{
                            presets: [
                              ["@babel/preset-env",{

                                useBuiltIns: "usage",
                                corejs: 3,
                                targets:"IE 10"
                              }]
                            ]
                        }
                    },
                  "ts-loader",
                ]},

        ]
    },
    resolve: {
        extensions: [".ts",".js"]
    },
    plugins:[
         new HtmlWebpackPlugin({
           minify:false
         })
    ]
};
