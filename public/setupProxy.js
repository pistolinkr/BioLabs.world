const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api/pubchem',
    createProxyMiddleware({
      target: 'https://pubchem.ncbi.nlm.nih.gov',
      changeOrigin: true,
      pathRewrite: {
        '^/api/pubchem': '/rest/pug',
      },
      onProxyRes: function (proxyRes, req, res) {
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
      },
    })
  );

  app.use(
    '/api/kegg',
    createProxyMiddleware({
      target: 'https://rest.kegg.jp',
      changeOrigin: true,
      pathRewrite: {
        '^/api/kegg': '',
      },
      onProxyRes: function (proxyRes, req, res) {
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
      },
    })
  );
};
