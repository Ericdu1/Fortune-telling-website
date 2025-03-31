const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // 仅在开发环境下使用代理
  app.use(
    '/api',
    createProxyMiddleware({
      target: process.env.NODE_ENV === 'production' 
        ? process.env.VERCEL_URL || 'https://your-vercel-app.vercel.app'
        : 'http://localhost:3005',
      changeOrigin: true,
    })
  );
}; 