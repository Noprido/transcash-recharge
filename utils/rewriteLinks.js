const cheerio = require('cheerio');
const rewriteUrl = require('./rewriteUrl');

function rewriteLinks(html, targetUrl, proxyUrl) {
  const $ = cheerio.load(html);
  const targetUrlObj = new URL(targetUrl);
  const targetOrigin = targetUrlObj.origin; // https://www.example.com
  
  // ==========================================
  // 🔗 NAVIGATION : Via le proxy
  // ==========================================
  
  // 1️⃣ Réécrire les liens <a href="">
  $('a[href]').each((i, elem) => {
    const href = $(elem).attr('href');
    const newHref = rewriteUrl(href, targetOrigin, proxyUrl);
    $(elem).attr('href', newHref);
  });
  
  // 2️⃣ Réécrire les formulaires <form action="">
  $('form[action]').each((i, elem) => {
    const action = $(elem).attr('action');
    const newAction = rewriteUrl(action, targetOrigin, proxyUrl);
    $(elem).attr('action', newAction);
  });
  
  // Bonus : Modifier "Example" → "Teapot"
  const finalHtml = $.html().replaceAll('Example', 'Teapot');
  
  return finalHtml;
}

module.exports = rewriteLinks;