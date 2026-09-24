const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'portfolio.db');
const db = new Database(dbPath);

// Enable WAL mode for high concurrency & reliability
db.pragma('journal_mode = WAL');

// Initialize database schema
function initDatabase() {
  // 1. Contact Form Submissions Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      read_status INTEGER DEFAULT 0
    );
  `);

  // 2. Projects Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      summary TEXT NOT NULL,
      description TEXT NOT NULL,
      tools TEXT NOT NULL,
      highlights TEXT NOT NULL,
      github_url TEXT,
      demo_url TEXT,
      icon TEXT,
      badge TEXT,
      order_index INTEGER DEFAULT 0
    );
  `);

  // 3. Education Milestones Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS education (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      degree TEXT NOT NULL,
      institution TEXT NOT NULL,
      board_university TEXT NOT NULL,
      period TEXT NOT NULL,
      score_grade TEXT NOT NULL,
      honors TEXT NOT NULL,
      description TEXT NOT NULL,
      key_subjects TEXT NOT NULL,
      badge TEXT,
      order_index INTEGER DEFAULT 0
    );
  `);

  // 4. Competitions & Achievements Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS competitions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      award TEXT NOT NULL,
      event_name TEXT NOT NULL,
      organizer TEXT NOT NULL,
      year TEXT NOT NULL,
      description TEXT NOT NULL,
      badge_color TEXT,
      order_index INTEGER DEFAULT 0
    );
  `);

  // 5. Internships Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS internships (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      role TEXT NOT NULL,
      company TEXT NOT NULL,
      location TEXT NOT NULL,
      period TEXT NOT NULL,
      type TEXT NOT NULL,
      description TEXT NOT NULL,
      learnings TEXT NOT NULL,
      order_index INTEGER DEFAULT 0
    );
  `);

  seedDefaultData();
}

// Seed rich initial data if tables are empty
function seedDefaultData() {
  // Check and seed education
  const educationCount = db.prepare('SELECT COUNT(*) as count FROM education').get().count;
  if (educationCount === 0) {
    const insertEducation = db.prepare(`
      INSERT INTO education (degree, institution, board_university, period, score_grade, honors, description, key_subjects, badge, order_index)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const educationData = [
      [
        'Bachelor of Technology (B.Tech) in Electrical Engineering',
        'Government College of Engineering Yavatmal',
        'Dr. Babasaheb Ambedkar Technological University (DBATU)',
        '2024 - 2027',
        'CGPA: 8.05 / 10.0',
        'Academic Topper (3rd Year)',
        'Pursuing Bachelor of Technology in Electrical Engineering, focusing on power systems, high voltage equipment, electrical machines, and modern control engineering.',
        'Power System Analysis, Switchgear & Protection, Electrical Machines, High Voltage Engineering, Control Systems, Power Electronics',
        'B.Tech',
        1
      ],
      [
        'Diploma in Electrical Engineering',
        'Government Polytechnic College Gondia',
        'Maharashtra State Board of Technical Education (MSBTE)',
        '2021 - 2024',
        'Percentage: 87.44% (Distinction)',
        'Academic Topper (2nd & 3rd Year)',
        'Completed 3-year diploma in Electrical Engineering with distinction, gaining rigorous hands-on training in electrical machines, panel wiring, and transformer testing.',
        'Electrical Machines (AC/DC), Transmission & Distribution, Industrial Electronics, PLC & Microcontrollers, Electrical Estimating & Costing',
        'Diploma',
        2
      ],
      [
        'Secondary School Certificate (SSC / 10th Standard)',
        'Shri Gurunanak High School, Gondia',
        'Maharashtra State Board',
        '2020 - 2021',
        'Percentage: 86.80% (Distinction)',
        'Distinction',
        'Completed secondary school education with strong grounding in Mathematics, Physical Sciences, and Analytical Reasoning.',
        'Mathematics, Physical Science, English, Social Sciences, Information Technology',
        'SSC',
        3
      ]
    ];

    for (const edu of educationData) {
      insertEducation.run(...edu);
    }
  }

  // Check and seed projects
  const projectCount = db.prepare('SELECT COUNT(*) as count FROM projects').get().count;
  if (projectCount === 0) {
    const insertProject = db.prepare(`
      INSERT INTO projects (title, category, summary, description, tools, highlights, github_url, demo_url, icon, badge, order_index)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const projectData = [
      [
        'Classroom Automation and Student Counter',
        'Industrial Automation',
        'An Arduino UNO based project that can count the student entering and leaving classroom and also turns the lights on and off as per the presence of student in the class.',
        'An Arduino UNO based project that can count the student entering and leaving classroom and also turns the lights on and off as per the presence of student in the class.',
        'Arduino UNO, Bidirectional IR Sensors, Relay Module, 16x2 LCD Display, C++',
        'Bidirectional student counter; automated occupancy-based light control.',
        'https://github.com/Akash-sketch-tech',
        '#',
        'cpu',
        'Automation',
        1
      ],
      [
        'Dual Axis Solar Panel',
        'Renewable Energy',
        'Solar panel that can move on its axis and can move from facing one direction to another for maximum efficiency.',
        'Solar panel that can move on its axis and can move from facing one direction to another for maximum efficiency.',
        'Microcontroller, LDR Sensor Array, Dual Servo Motors, Solar PV Panel, DC-DC Converter',
        'Dual-axis movement tracks sunlight dynamically for maximum panel efficiency.',
        'https://github.com/Akash-sketch-tech',
        '#',
        'sun',
        'Renewable Energy',
        2
      ],
      [
        'Wireless Charging to Electric Vehicle',
        'Embedded & EV',
        'An EV that can get charge while running on road.',
        'An EV that can get charge while running on road.',
        'Resonant Inductive Coupling Coils, High-Frequency Inverter, Power MOSFETs, Rectifier Circuit',
        'Dynamic on-road wireless charging allowing electric vehicles to charge while in motion.',
        'https://github.com/Akash-sketch-tech',
        '#',
        'battery-charging',
        'EV Technology',
        3
      ]
    ];

    for (const proj of projectData) {
      insertProject.run(...proj);
    }
  }

  // Check and seed competitions
  const compCount = db.prepare('SELECT COUNT(*) as count FROM competitions').get().count;
  if (compCount === 0) {
    const insertComp = db.prepare(`
      INSERT INTO competitions (title, award, event_name, organizer, year, description, badge_color, order_index)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const competitionData = [
      [
        'Institute Level Quiz Competition',
        '1st Prize (Winner)',
        'Institute Level Quiz Competition',
        'Government Polytechnic Gondia',
        '2023',
        'Won Institute level Quiz Competition in 2023 in Government Polytechnic Gondia.',
        'sky',
        1
      ],
      [
        'Best Research Paper Award',
        'Winner',
        'Technical Paper Presentation',
        'Government Polytechnic Gondia',
        '2023',
        'Won best research paper award in 2023 in Government Polytechnic Gondia.',
        'emerald',
        2
      ],
      [
        'Best Project Award',
        'Winner (Final Year)',
        'Diploma Final Year Project Evaluation',
        'Government Polytechnic Gondia',
        '2024',
        'Won best Project award in the final year of Diploma.',
        'amber',
        3
      ],
      [
        'Academic Topper in 2nd & 3rd Year Diploma',
        'Academic Topper',
        'Diploma in Electrical Engineering',
        'Government Polytechnic College Gondia',
        '2023 - 2024',
        'Academic topper for 2nd and 3rd year of diploma.',
        'purple',
        4
      ],
      [
        'Academic Topper in 3rd Year Engineering',
        'Academic Topper',
        'B.Tech Electrical Engineering',
        'Government College of Engineering Yavatmal',
        '2026',
        'Academic topper for 3rd year in Engineering.',
        'blue',
        5
      ],
      [
        'Best Performer in IoT + Antigravity Workshop',
        'Best Performer Award',
        'IoT + Antigravity Workshop',
        'Government College of Engineering Yavatmal',
        '2025',
        'Won Best performer award in IoT+Antigravity Workshop at Government College of Engineering Yavatmal.',
        'rose',
        6
      ]
    ];

    for (const comp of competitionData) {
      insertComp.run(...comp);
    }
  }

  // Check and seed internships
  const internCount = db.prepare('SELECT COUNT(*) as count FROM internships').get().count;
  if (internCount === 0) {
    const insertIntern = db.prepare(`
      INSERT INTO internships (role, company, location, period, type, description, learnings, order_index)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const internshipData = [
      [
        'Transformer Repairing And Testing',
        'Sonali Power Equipments Private Limited',
        'Nagpur, Maharashtra',
        'June 2023 – July 2023',
        'Transformer Repairing & Testing',
        'Inspected and assessed transformers for damage or potential failures to ensure safe and reliable operation.',
        'Replaced transformer bushings and accessories, maintaining safety and electrical integrity.',
        1
      ],
      [
        'Electric Motor Mechanic',
        'Mai Electricals, Yavatmal',
        'Yavatmal, Maharashtra',
        'Jan 2025 – Feb 2025',
        'Electric Motor Mechanic',
        'Performed routine maintenance and preventive inspections on electric motors, identifying potential problems and implementing corrective actions to minimize downtime.',
        'Repaired and maintained electric motors and related electrical systems, ensuring optimal performance and longevity of equipment.',
        2
      ],
      [
        'Transformer Builder',
        'Highrise Transformers, Nagpur',
        'Nagpur, Maharashtra',
        'Jul 2025 – Aug 2025',
        'Transformer Builder',
        'Operated vacuum impregnating and oil purification equipment to ensure proper impregnation and insulation of transformer components.',
        'Constructed and assembled distribution and power transformers up to 115kV with a capacity of 1050 MVA.',
        3
      ],
      [
        'Electrical Maintenance Intern',
        'TATA Advanced Systems Ltd.',
        'Nagpur, Maharashtra',
        'Jul 2026 – Aug 2026',
        'Electrical Maintenance',
        'Testing of industrial electrical equipment and control panels.',
        'Testing of industrial electrical equipment and control panels.',
        4
      ]
    ];

    for (const intern of internshipData) {
      insertIntern.run(...intern);
    }
  }
}

// Database helper functions
const dbQueries = {
  // Contacts
  saveContact: (name, email, phone, subject, message) => {
    const stmt = db.prepare(`
      INSERT INTO contacts (name, email, phone, subject, message)
      VALUES (?, ?, ?, ?, ?)
    `);
    const info = stmt.run(name, email, phone || null, subject, message);
    return info.lastInsertRowid;
  },

  getAllContacts: () => {
    return db.prepare('SELECT * FROM contacts ORDER BY created_at DESC').all();
  },

  getContactById: (id) => {
    return db.prepare('SELECT * FROM contacts WHERE id = ?').get(id);
  },

  // Projects
  getAllProjects: (category) => {
    if (category && category !== 'All') {
      return db.prepare('SELECT * FROM projects WHERE category = ? ORDER BY order_index ASC').all(category);
    }
    return db.prepare('SELECT * FROM projects ORDER BY order_index ASC').all();
  },

  // Education
  getAllEducation: () => {
    return db.prepare('SELECT * FROM education ORDER BY order_index ASC').all();
  },

  // Competitions
  getAllCompetitions: () => {
    return db.prepare('SELECT * FROM competitions ORDER BY order_index ASC').all();
  },

  // Internships
  getAllInternships: () => {
    return db.prepare('SELECT * FROM internships ORDER BY order_index ASC').all();
  },

  // Summary stats
  getStats: () => {
    const projectCount = db.prepare('SELECT COUNT(*) as count FROM projects').get().count;
    const competitionCount = db.prepare('SELECT COUNT(*) as count FROM competitions').get().count;
    const internshipCount = db.prepare('SELECT COUNT(*) as count FROM internships').get().count;
    const contactCount = db.prepare('SELECT COUNT(*) as count FROM contacts').get().count;
    return {
      projects: projectCount,
      competitions: competitionCount,
      internships: internshipCount,
      contacts: contactCount,
      qualifications: 'Diploma + Degree in EE'
    };
  }
};

module.exports = {
  db,
  initDatabase,
  ...dbQueries
};

// Allow CLI reset: `node database.js --reset`
if (require.main === module) {
  if (process.argv.includes('--reset')) {
    console.log('🔄 Re-seeding database from database.js definitions...');
    db.exec(`
      DROP TABLE IF EXISTS competitions;
      DROP TABLE IF EXISTS projects;
      DROP TABLE IF EXISTS education;
      DROP TABLE IF EXISTS internships;
    `);
    initDatabase();
    console.log('✅ Database successfully re-seeded! Refresh your browser to see updates.');
  } else {
    initDatabase();
    console.log('✅ Database checked and ready.');
  }
}

