const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/profile', (req, res) => {
  const profilePath = path.join(__dirname, 'data', 'profile.json');
  fs.readFile(profilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'No se pudo cargar el perfil' });
    }
    res.type('application/json').send(data);
  });
});

app.get('/cv', (req, res) => {
  const cvPath = path.join(__dirname, 'public', 'assets', 'CV_Diego_Cartes_Solorza.pdf');
  res.download(cvPath, 'CV_Diego_Cartes_Solorza.pdf', (err) => {
    if (err && !res.headersSent) {
      res.status(404).send('CV no disponible');
    }
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Portafolio corriendo en http://localhost:${PORT}`);
});
