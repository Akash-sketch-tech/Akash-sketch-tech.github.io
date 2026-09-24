const fs = require('fs');
const path = require('path');
const db = require('./database.js');

const data = {
  success: true,
  data: {
    projects: db.getAllProjects(),
    education: db.getAllEducation(),
    competitions: db.getAllCompetitions(),
    internships: db.getAllInternships(),
    stats: db.getStats()
  }
};

// 1. Write to public/data/portfolio-data.json
const publicDataDir = path.join(__dirname, 'public', 'data');
if (!fs.existsSync(publicDataDir)) fs.mkdirSync(publicDataDir, { recursive: true });
fs.writeFileSync(path.join(publicDataDir, 'portfolio-data.json'), JSON.stringify(data, null, 2), 'utf8');

// 2. Sync to docs/ and root for GitHub Pages
const docsDir = path.join(__dirname, 'docs');
if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });
fs.cpSync(path.join(__dirname, 'public'), docsDir, { recursive: true, force: true });

// 3. Sync static assets to root for GitHub Pages user site default path
const itemsToSync = ['assets', 'css', 'js', 'data', 'index.html'];
for (const item of itemsToSync) {
  const src = path.join(__dirname, 'public', item);
  const dest = path.join(__dirname, item);
  if (fs.existsSync(src)) {
    fs.cpSync(src, dest, { recursive: true, force: true });
  }
}

console.log('✅ Successfully exported static portfolio data and synced to /docs and root for GitHub Pages!');
