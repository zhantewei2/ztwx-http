const path=require("path");
const join=(...args)=>path.join(process.cwd(),...args);

module.exports={
  mode:"production",
  entry:join("package/index.ts"),
  experiments: {
    outputModule: true
  },
  output:{
    path:join("lib"),
    filename: "index.js",
    library: {
      type:"module"
    }
  },
  module:{
    rules: [
      {
        test:/\.ts$/,
        use:[{
          loader:"ts-loader",
          options: {}
        }],
      }
    ]
  },
  resolve: {
    extensions: [".ts",".js"]
  }
};