const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// 
module.exports = {
  outputDir : path.resolve(__dirname,'../public'),
  // 이건 webpack analysis할때 사용하는 모듈. 이 주석 풀고 웹페이지(localhost:8008) wB가 아닌 분석화면이 뜬다
  // configureWebpack: {
  //   plugins: [new BundleAnalyzerPlugin()]
  // },
  devServer: {
      historyApiFallback : true, // history mode에서 cannot get을 해결해준다는데, 안된다;;
      disableHostCheck: true,//이걸 꼭 넣어야만 [HMR] Waiting for update signal from WDS...에러가 뜨지 않는다.
  },  
};