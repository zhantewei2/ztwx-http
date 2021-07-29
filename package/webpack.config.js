const path=require("path");
const join=(...args)=>path.join(process.cwd(),...args);
const libraryName="voyoHttp";
module.exports={
  mode:"production",
  entry:{
    "module":{
      import:join("package/index.ts"),
      library: {
        type:"module"
      }
    },
    "commonjs":{
      import:join("package/index.ts"),
      library: {
        name:libraryName,
        type:"commonjs",
      }
    },
    "window":{
      import:join("package/index.ts"),
      library: {
        name:libraryName,
        type:"window"
      }
    }
  },
  experiments: {
    outputModule: true
  },
  optimization:{
    sideEffects:true
  },
  output:{
    clean:true,
    path:join("lib"),
    filename: "index.[name].js",
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
  },
  plugins: []
};
