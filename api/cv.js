const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  const cvPath = path.join(process.cwd(), 'public', 'assets', 'CV_Diego_Cartes_Solorza.pdf');
  try {
    const data = fs.readFileSync(cvPath);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="CV_Diego_Cartes_Solorza.pdf"');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.status(200).send(data);
  } catch (err) {
    res.status(404).send('CV no disponible');
  }
};
