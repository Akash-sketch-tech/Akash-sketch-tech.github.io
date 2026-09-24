const express = require('express');
const path = require('path');
const fs = require('fs');
const {
  initDatabase,
  saveContact,
  getAllContacts,
  getContactById,
  getAllProjects,
  getAllEducation,
  getAllCompetitions,
  getAllInternships,
  getStats
} = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize database schema and initial seed data
initDatabase();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Security and CORS basic headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  next();
});

// Health check endpoint (for Render / uptime monitoring)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// API: Get entire portfolio data package in one request
app.get('/api/portfolio-data', (req, res) => {
  try {
    const projects = getAllProjects();
    const education = getAllEducation();
    const competitions = getAllCompetitions();
    const internships = getAllInternships();
    const stats = getStats();

    res.json({
      success: true,
      data: {
        projects,
        education,
        competitions,
        internships,
        stats
      }
    });
  } catch (error) {
    console.error('Error fetching portfolio data:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve portfolio data' });
  }
});

// API: Get projects with optional category filter
app.get('/api/projects', (req, res) => {
  try {
    const { category } = req.query;
    const projects = getAllProjects(category);
    res.json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: Get education milestones
app.get('/api/education', (req, res) => {
  try {
    const education = getAllEducation();
    res.json({ success: true, education });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: Get competitions & achievements
app.get('/api/competitions', (req, res) => {
  try {
    const competitions = getAllCompetitions();
    res.json({ success: true, competitions });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: Get internships
app.get('/api/internships', (req, res) => {
  try {
    const internships = getAllInternships();
    res.json({ success: true, internships });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: Get statistics
app.get('/api/stats', (req, res) => {
  try {
    const stats = getStats();
    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: Contact Form Submission (Stores in SQLite)
app.post('/api/contact', (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Please provide your full name.' });
    }
    if (!email || !email.trim() || !email.includes('@')) {
      return res.status(400).json({ success: false, error: 'Please provide a valid email address.' });
    }
    if (!subject || !subject.trim()) {
      return res.status(400).json({ success: false, error: 'Please provide a subject.' });
    }
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, error: 'Please enter your message.' });
    }

    const contactId = saveContact(
      name.trim(),
      email.trim(),
      phone ? phone.trim() : null,
      subject.trim(),
      message.trim()
    );

    console.log(`[Contact Form] New submission #${contactId} from ${name.trim()} <${email.trim()}>`);

    res.status(201).json({
      success: true,
      message: 'Thank you for reaching out! Your message has been received, and Akash will get back to you shortly.',
      submissionId: contactId
    });
  } catch (error) {
    console.error('Error saving contact form submission:', error);
    res.status(500).json({ success: false, error: 'Failed to submit message. Please try again or email directly.' });
  }
});

// API: View Contact Submissions (Admin/Reviewer endpoint)
app.get('/api/contacts', (req, res) => {
  try {
    const contacts = getAllContacts();
    res.json({ success: true, count: contacts.length, contacts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Route: Download Resume
app.get('/download-resume', (req, res) => {
  const resumePath = path.join(__dirname, 'public', 'assets', 'Akash_Damahe_Resume.pdf');
  if (fs.existsSync(resumePath)) {
    res.download(resumePath, 'Akash_Damahe_Electrical_Engineer_Resume.pdf');
  } else {
    // Fallback: redirect to resume viewer or notify
    res.redirect('/assets/Akash_Damahe_Resume.pdf');
  }
});

// Fallback route to serve SPA for any unmatched request
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Express server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`⚡ Akash Damahe Portfolio Server running on port ${PORT}`);
  console.log(`🔗 Local URL: http://localhost:${PORT}`);
  console.log(`📁 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`=======================================================`);
});
