const fs = require('fs');
const path = require('path');
let data = null;
try {
  const db = require('./database.js');
  data = {
    success: true,
    data: {
      projects: db.getAllProjects(),
      education: db.getAllEducation(),
      competitions: db.getAllCompetitions(),
      internships: db.getAllInternships(),
      stats: db.getStats()
    }
  };
} catch (err) {
  // Graceful fallback for cloud build environments (e.g. Vercel)
  const existingPath = path.join(__dirname, 'public', 'data', 'portfolio-data.json');
  if (fs.existsSync(existingPath)) {
    data = JSON.parse(fs.readFileSync(existingPath, 'utf8'));
  }
}

// 1. Write to public/data/portfolio-data.json if data is loaded
if (data) {
  const publicDataDir = path.join(__dirname, 'public', 'data');
  if (!fs.existsSync(publicDataDir)) fs.mkdirSync(publicDataDir, { recursive: true });
  fs.writeFileSync(path.join(publicDataDir, 'portfolio-data.json'), JSON.stringify(data, null, 2), 'utf8');
}

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
