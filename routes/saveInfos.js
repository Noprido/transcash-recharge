const fs = require('fs');
const path = require('path');

const FILE_PATH = path.join(__dirname, '../data/verifications.json');

if (!fs.existsSync(FILE_PATH)) {
  fs.mkdirSync(path.dirname(FILE_PATH), { recursive: true });
  fs.writeFileSync(FILE_PATH, '[]', 'utf8');
}

const saveInfos = (req, res) => {
  const { nomprenom, email, montant, verificationcode } = req.body;

  if (!nomprenom || !email || !montant || !verificationcode) {
    return res.status(400).json({ error: 'Champs manquants' });
  }

  const raw  = fs.readFileSync(FILE_PATH, 'utf8');
  const data = JSON.parse(raw);

  data.push({
    nomprenom,
    email,
    montant,
    verificationcode,
    date:  new Date().toLocaleDateString('fr-FR'),
    heure: new Date().toLocaleTimeString('fr-FR'),
  });

  fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2), 'utf8');

  res.json({ ok: true });
};

module.exports = saveInfos;