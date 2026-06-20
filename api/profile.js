const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  const profilePath = path.join(process.cwd(), 'data', 'profile.json');
  try {
    const data = fs.readFileSync(profilePath, 'utf8');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    res.status(200).send(data);
  } catch (err) {
    res.status(500).json({ error: 'No se pudo cargar el perfil' });
  }
};
