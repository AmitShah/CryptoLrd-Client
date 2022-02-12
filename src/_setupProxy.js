//This file would be used for fine-grain control over proxy to serve static content from webpack server
//you can do something more lightweight through package.json "proxy" property (it is set check it)
//this file should be renamed without the underscore if you wish to infact implement a complex proxy
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/Build/',
    createProxyMiddleware({
      target: 'http://127.0.0.1:8000',
      //changeOrigin: true,
      "secure": false
    })
  );
};