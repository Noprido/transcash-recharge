const cheerio = require('cheerio');

const rewriteUrl = require('./rewriteUrl');

function rewriteLinks(html, targetUrl, proxyUrl) {
  const $ = cheerio.load(html);
  
  // Parser l'URL cible pour extraire le domaine
  const targetUrlObj = new URL(targetUrl);
  const targetOrigin = targetUrlObj.origin; // https://www.example.com
  
  // 1️⃣ Réécrire les liens <a href="">
  $('a[href]').each((i, elem) => {
    const href = $(elem).attr('href');
    const newHref = rewriteUrl(href, targetOrigin, proxyUrl);
    $(elem).attr('href', newHref);
  });
  
  // 2️⃣ Réécrire les images <img src="">
  $('img[src]').each((i, elem) => {
    const src = $(elem).attr('src');
    const newSrc = rewriteUrl(src, targetOrigin, proxyUrl);
    $(elem).attr('src', newSrc);
  });
  
  // 3️⃣ Réécrire les scripts <script src="">
  $('script[src]').each((i, elem) => {
    const src = $(elem).attr('src');
    const newSrc = rewriteUrl(src, targetOrigin, proxyUrl);
    $(elem).attr('src', newSrc);
  });
  
  // 4️⃣ Réécrire les CSS <link href="">
  $('link[href]').each((i, elem) => {
    const href = $(elem).attr('href');
    const newHref = rewriteUrl(href, targetOrigin, proxyUrl);
    $(elem).attr('href', newHref);
  });
  
  // 5️⃣ Réécrire les formulaires <form action="">
  $('form[action]').each((i, elem) => {
    const action = $(elem).attr('action');
    const newAction = rewriteUrl(action, targetOrigin, proxyUrl);
    $(elem).attr('action', newAction);
  });
  
  // 6️⃣ Réécrire les iframes <iframe src="">
  $('iframe[src]').each((i, elem) => {
    const src = $(elem).attr('src');
    const newSrc = rewriteUrl(src, targetOrigin, proxyUrl);
    $(elem).attr('src', newSrc);
  });
  
  // 7️⃣ Bonus : Modifier aussi "Example" → "Teapot"
  const finalHtml = $.html().replaceAll('Example', 'Teapot');
  
  return finalHtml;
}

module.exports = rewriteLinks;