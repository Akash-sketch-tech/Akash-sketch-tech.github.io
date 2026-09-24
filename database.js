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
        'Bachelor of Engineering (B.E.) in Electrical Engineering',
        'Government College of Engineering / Renowned Technical University',
        'State Technological University (Accredited A+ Grade)',
        '2022 - 2025',
        'CGPA: 9.42 / 10.0 (First Class with Distinction)',
        'Department Topper & Gold Medalist (Academic Excellence Award)',
        'Specialized in Power Systems, High Voltage Switchgear, Renewable Energy Integration, and Industrial Automation. Consistently secured 1st rank across all semesters with distinction honors.',
        'Power System Analysis, Switchgear & Protection, Electrical Drives & Control, High Voltage Engineering, Renewable Energy Systems, Control Systems',
        'Degree Topper',
        1
      ],
      [
        'Diploma in Electrical Engineering',
        'Government Polytechnic Institute',
        'State Board of Technical Education (MSBTE/SBTE)',
        '2019 - 2022',
        'Percentage: 92.80% (First Class with Distinction)',
        'Polytechnic Institute Topper & State Merit List Honoree',
        'Comprehensive foundational practical engineering training emphasizing electrical machines, industrial wiring, transformer maintenance, power transmission, and electronics.',
        'Electrical Machines (AC/DC), Transmission & Distribution, Industrial Electronics, PLC & Microcontrollers, Electrical Estimating & Costing',
        'Diploma Topper',
        2
      ],
      [
        'Secondary School Certificate (SSC / 10th Standard)',
        'Adarsh High School & Junior College',
        'State Secondary & Higher Secondary Education Board',
        '2018 - 2019',
        'Percentage: 93.60% (Distinction)',
        'School Merit Topper in Science & Mathematics',
        'Strong foundation in Mathematics, Physical Sciences, and Analytical Reasoning with honors.',
        'Advanced Mathematics, Physical Sciences, Information Technology, English',
        'School Merit',
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
        'Arduino UNO-based bidirectional student counter and intelligent classroom lighting/load control system.',
        'Designed and built an intelligent classroom energy management system powered by an Arduino UNO and bidirectional infrared (IR) beam sensors. The system accurately tallies students entering and exiting the classroom, dynamically switching lighting and ceiling fan relays based on real-time occupancy to eliminate idle standby power consumption.',
        'Arduino UNO, Bidirectional IR Sensors, 5V/230V Relay Module, 16x2 LCD Display, C++, Proteus',
        'Real-time bidirectional occupant count tracking; automated zero-idle relay switching for AC lighting.',
        'https://github.com/akashdamahe',
        '#',
        'cpu',
        'IoT & Automation',
        1
      ],
      [
        'Dual Axis Solar Panel Tracker',
        'Renewable Energy',
        'Sun-tracking photovoltaic rig with dual-axis servo rotation maximizing solar irradiance capture and panel efficiency.',
        'Engineered an active dual-axis solar photovoltaic tracking prototype capable of dynamic movement across both azimuth and elevation axes. Employs light-dependent resistor (LDR) sensor arrays and servo actuator mechanisms to continually face the sun perpendicular to the panel plane, significantly boosting overall solar power harvest compared to stationary panels.',
        'Arduino / Microcontroller, LDR Sensor Array, Dual Servo Motors, Solar PV Module, DC-DC Buck Converter, Proteus',
        'Dual-axis orientation tracking maximizes daily PV energy harvesting by up to 30–40%; automated night repositioning.',
        'https://github.com/akashdamahe',
        '#',
        'sun',
        'Renewable Energy',
        2
      ],
      [
        'Wireless Charging for Electric Vehicles (On-Road Dynamic Charging)',
        'Embedded & EV',
        'Dynamic inductive contactless power transfer system allowing electric vehicles to charge while in motion on the roadway.',
        'Researched and prototyped an on-the-move dynamic wireless power transfer (DWPT) system for Electric Vehicles. Employs high-frequency resonant inductive coupling between transmitter primary coils embedded beneath the road surface and a secondary receiver pickup coil mounted on the EV chassis, eliminating range anxiety and minimizing onboard battery pack weight.',
        'Resonant Inductive Coupling, High-Frequency Inverter (PWM), Ferrite Coils, Power MOSFETs, Rectifier, MATLAB/Simulink',
        'Dynamic on-road wireless inductive charging; mitigates EV range anxiety and significantly reduces required battery mass.',
        'https://github.com/akashdamahe',
        '#',
        'battery-charging',
        'Cutting-Edge EV',
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
        'College Level Technical Project Expo',
        '1st Prize (Winner)',
        'Annual Technical Project Exhibition',
        'Government Polytechnic / Engineering College',
        '2024',
        'Awarded 1st Prize for designing and demonstrating innovative electrical engineering hardware models and embedded automation solutions.',
        'amber',
        1
      ],
      [
        'Extempore Speech Competition',
        '2nd Prize',
        'Inter-College Elocution & Communication Meet',
        'Student Council & Technical Literary Club',
        '2023',
        'Secured 2nd prize in extempore speech presenting analytical perspectives on emerging renewable energy trends and grid sustainability.',
        'blue',
        2
      ],
      [
        'Conference on Emerging Trends in Electrical Engineering (NCETEE)',
        'Best Research Paper Award',
        'National Technical Conference',
        'Faculty of Electrical Engineering',
        '2024',
        'Authored and presented technical research on modern power distribution, smart grid automation, and renewable energy integration.',
        'emerald',
        3
      ],
      [
        'Academic Topper in 2nd Year Diploma in Electrical Engineering',
        'Rank 1 (Department Distinction)',
        'Annual Board Technical Examinations',
        'State Board of Technical Education',
        '2021',
        'Ranked 1st in the department across 2nd year Diploma coursework with distinction honors in core electrical subjects.',
        'purple',
        4
      ],
      [
        'Academic Topper in 3rd Year Electrical Engineering',
        'Rank 1 (Gold Medalist)',
        'Final Board Technical Examinations',
        'State Board of Technical Education',
        '2022',
        'Secured highest aggregate marks in the graduating diploma batch with distinction in electrical machines, transmission, and switchgear.',
        'amber',
        5
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
        'Electrical Engineering Intern',
        'Sonali Power Equipments Private Limited',
        'Industrial Area, India',
        '6 Weeks (2023)',
        'Power Equipment & Transformer Testing',
        'Inspected and assessed power transformers for damage or potential failures to ensure safe and reliable industrial operation.',
        'Conducted insulation resistance testing, turns ratio testing, oil dielectric breakdown voltage (BDV) tests, and transformer assembly inspections.',
        1
      ],
      [
        'Electric Motor Mechanic Trainee',
        'Mai Electricals',
        'Yavatmal, India',
        '1 Month (2025)',
        'Electric Motor Maintenance & Overhaul',
        'Performed routine maintenance and preventive inspections on AC and DC electric motors, identifying potential electrical and mechanical problems.',
        'Assisted with stator winding resistance tests, bearing inspection and lubrication, motor terminal connection verification, and starter panel troubleshooting.',
        2
      ],
      [
        'Transformer Builder Intern',
        'Highrise Transformers',
        'Nagpur, India',
        '1 Month (2025)',
        'Transformer Manufacturing & Insulation',
        'Operated vacuum impregnating and oil purification equipment to ensure proper impregnation and insulation of transformer components.',
        'Mastered vacuum varnish impregnation processes, core-coil assembly techniques, dielectric oil dehydration/filtration, and high-voltage safety practices.',
        3
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

