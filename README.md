# ⚡ Akash Damahe — Professional Electrical Engineering Portfolio

A modern, responsive, and high-performance personal portfolio website for **Akash Damahe**, an Electrical Engineer holding both a **Diploma in Electrical Engineering** and a **Bachelor's Degree in Electrical Engineering** with top academic honors (Department & State Board Topper).

Built with a clean light mode by default, seamless dark mode toggle, interactive SQLite-backed contact and dynamic portfolio API, and ready for 1-click deployment on **Render** via **GitHub**.

---

## 🚀 Live Demo & Tech Stack

- **Frontend**: HTML5, Tailwind CSS (via CDN with extended design tokens), Vanilla JavaScript (ES6+), Google Fonts (*Plus Jakarta Sans* & *JetBrains Mono*).
- **Backend**: Node.js, Express 5.x REST API.
- **Database**: SQLite3 via `better-sqlite3` (WAL mode enabled for speed and atomic persistence).
- **Deployment**: Render-ready with dynamic port binding (`process.env.PORT || 3000`), zero external database configuration needed.

---

## 📁 Project Directory Structure

```text
AKASH PORTFOLIO/
├── data/
│   └── portfolio.db              # SQLite database (auto-created & auto-seeded on first run)
├── public/
│   ├── index.html                # Responsive, accessible, semantic portfolio website
│   ├── css/
│   │   └── style.css             # Circuit patterns, electrical glow effects, theme styling
│   ├── js/
│   │   └── app.js                # Frontend logic: dark mode toggle, SQLite APIs, modals, toast
│   └── assets/
│       ├── placeholder-avatar.svg # Professional electrical engineer avatar & badge placeholder
│       └── Akash_Damahe_Resume.pdf# ATS-friendly 2-page downloadable resume
├── database.js                   # SQLite schema, seed data, and query helper methods
├── server.js                     # Express server, REST endpoints, and static file router
├── generate-resume.js            # Node.js PDF generator for Akash's official resume
├── render.yaml                   # Optional Render Blueprint for 1-click deployment
├── package.json                  # Scripts ("start", "dev") and dependencies
├── .gitignore                    # Ignores node_modules, temp files, and local logs
└── README.md                     # Documentation and deployment walkthrough
```

---

## 🌟 Key Features & Sections

1. **Home / Hero Section**:
   - **Left Column**: Professional tagline emphasizing the dual engineering foundation (Diploma + Degree), intro summary, quick metrics strip (*#1 Rank / Topper*, *6+ Projects*, *5+ Wins*, *3 Internships*), **"Download Resume"** button, and **"Contact Me"** button.
   - **Right Column**: Medium-sized circular profile photo container with rotating dashed circuit rings, pulsing glow, and floating distinction badges.
2. **About Me Section**:
   - Detailed narrative of Akash's technical journey: bridging the practical field expertise from a 3-year Polytechnic Diploma with theoretical and analytical depth from a Bachelor's Degree.
   - Core competency pillars: *Power Systems & Substations*, *Industrial Automation & Drives*, and *Renewable Solar PV & EV*.
   - Technical Skill Matrix across CAD, Automation, Power Systems, and Embedded Programming.
3. **Education Section**:
   - Timeline highlighting academic distinctions:
     - **B.E. in Electrical Engineering** (CGPA: 9.42 / 10.0 — Department Topper & Gold Medalist).
     - **Diploma in Electrical Engineering** (92.80% Distinction — State Board Merit List Honoree & Institute Topper).
     - **Secondary School Certificate** (93.60% Distinction — School Merit Topper).
4. **Featured Projects Section**:
   - Filterable category grid (*Power Systems & Grid*, *Industrial Automation & PLC*, *Renewable & Solar PV*, *Embedded & EV BMS*).
   - Technical specification modal with problem statement, architecture, and tool stack.
5. **Competitions & Achievements Section**:
   - Highlights 1st Prize & Gold Trophy wins at National Level Technical Project Expos, State Circuit Debugging Championships, and Best Research Paper Awards at IEEE-sponsored conferences.
6. **Internships Section**:
   - Real-world experience at a **220kV/132kV Extra High Voltage Substation**, industrial **PLC & SCADA Automation plant**, and **Solar Photovoltaic EPC**.
7. **Contact Section & SQLite Persistence**:
   - Working contact form submitting directly to the Express server (`POST /api/contact`) and stored in `data/portfolio.db`.
   - Real-time animated notification toast.
   - **Database Messages Viewer (Admin)** modal in the footer to review submitted messages directly in the browser!
8. **Theme Toggle**:
   - Clean, professional light mode by default.
   - Seamless transition to high-contrast cyber-electric dark mode with local storage persistence.

---

## 💻 Local Setup & Development Instructions

### 1. Prerequisites
- **Node.js** (v18.0.0 or higher recommended, e.g. v20 or v24).
- **npm** (bundled with Node.js).

### 2. Installation
Open your terminal in the project directory:
```bash
# Clone or navigate to the project directory
cd "AKASH PORTFOLIO"

# Install project dependencies
npm install
```

### 3. Start the Server
```bash
# Production start mode
npm start

# OR development live-reload mode (Node 18+)
npm run dev
```

The server will initialize the SQLite database (`data/portfolio.db`), seed the default data, and listen on port **3000**:
```text
=======================================================
⚡ Akash Damahe Portfolio Server running on port 3000
🔗 Local URL: http://localhost:3000
📁 Environment: development
=======================================================
```

Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 🎨 How to Customize Your Portfolio

### 1. Adding Your Real Profile Photo
1. Place your photo inside `public/assets/` named `profile.jpg` (or `profile.png`).
2. Open `public/index.html` and update the `src` attribute of `#profile-photo-img` (around line 180):
   ```html
   <img id="profile-photo-img" src="/assets/profile.jpg" alt="Akash Damahe" class="...">
   ```

### 2. Updating Resume PDF
- You can place your own finalized resume PDF into `public/assets/Akash_Damahe_Resume.pdf`.
- Or edit `generate-resume.js` and run:
  ```bash
  node generate-resume.js
  ```

### 3. Adding or Modifying Projects & Content
- Open `database.js` to modify the default project items, education details, awards, or internships in the `seedDefaultData()` function.

---

## 🌐 Deploying Live on Render (Step-by-Step)

Deploying this portfolio on Render is free, fast, and takes under 3 minutes:

### Step 1: Initialize Git and Push to GitHub
If you haven't already pushed your code to GitHub:
```bash
# 1. Initialize git repository
git init

# 2. Add all project files (.gitignore will exclude node_modules)
git add .

# 3. Commit the changes
git commit -m "Initial commit: Akash Damahe Electrical Engineer Portfolio"

# 4. Create a new repository on https://github.com/new (e.g., akash-damahe-portfolio)
# 5. Link and push to GitHub:
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/akash-damahe-portfolio.git
git branch -M main
git push -u origin main
```

### Step 2: Create a Web Service on Render
1. Go to [https://dashboard.render.com](https://dashboard.render.com) and sign in (or register with GitHub).
2. Click the **"New +"** button in the top navigation and select **"Web Service"**.
3. Choose **"Build and deploy from a Git repository"** and click **Next**.
4. Connect your GitHub account and select your `akash-damahe-portfolio` repository.

### Step 3: Configure Service Settings
Fill in the deployment settings as follows:
- **Name**: `akash-damahe-portfolio` (or your preferred subdomain)
- **Region**: Choose the region closest to your target audience (e.g., *Singapore* or *Frankfurt* or *Oregon*)
- **Branch**: `main`
- **Root Directory**: (Leave blank / root)
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Instance Type**: `Free`

### Step 4: Environment Variables (Optional)
Render automatically assigns a dynamic port via `process.env.PORT`, which `server.js` already listens to:
```javascript
const PORT = process.env.PORT || 3000;
```
If you wish to specify environment flags, you can add:
- `NODE_ENV` = `production`

### Step 5: Deploy & Verify
1. Click **"Create Web Service"**.
2. Render will pull the code from GitHub, install dependencies with `npm install`, and run `npm start`.
3. Within 1-2 minutes, you will receive your live URL:
   `https://akash-damahe-portfolio.onrender.com`
4. Visit your live URL and test all interactive features!

---

## 🔌 API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Health check for uptime monitors & Render keep-alive |
| `GET` | `/api/portfolio-data` | Complete package of projects, education, competitions, internships, and stats |
| `GET` | `/api/projects` | Fetch all projects (or filter by `?category=Power%20Systems`) |
| `GET` | `/api/education` | Fetch academic milestones and topper honors |
| `GET` | `/api/competitions` | Fetch competition awards and symposium recognitions |
| `GET` | `/api/internships` | Fetch industrial internship records |
| `POST` | `/api/contact` | Submit contact form `{ name, email, phone, subject, message }` to SQLite |
| `GET` | `/api/contacts` | Admin endpoint to review submitted contact messages |
| `GET` | `/download-resume` | Triggers download of `Akash_Damahe_Resume.pdf` |

---

## 📄 License
This portfolio is open-sourced under the MIT License. Designed and developed for **Akash Damahe**.
