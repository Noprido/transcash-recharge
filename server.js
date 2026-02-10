const express = require('express');
const app = express();

app.use(express.json());

const {PROXY_URL, TARGET_URL, proxy} = require('./utils/proxy');

app.use((req, res, next) => {
  if (req.url.startsWith('/cdn-cgi/')) {
    // Redirection transparente vers Cloudflare
    res.redirect(302, TARGET_URL + req.url);
    return;
  }
  next();
});


app.use('/', proxy);


const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Le serveur démarre sur ${PROXY_URL}`);
});