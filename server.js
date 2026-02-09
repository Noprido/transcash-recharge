const express = require('express');
const app = express();

app.use(express.json());

const {PROXY_URL, proxy} = require('./utils/proxy');


app.use('/', proxy);


const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Le serveur démarre sur ${PROXY_URL}`);
});