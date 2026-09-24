const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, 'public', 'assets');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const outputPath = path.join(outputDir, 'Akash_Damahe_Resume.pdf');
const doc = new PDFDocument({ margin: 40, size: 'A4' });

const stream = fs.createWriteStream(outputPath);
doc.pipe(stream);

// Colors
const primaryColor = '#0f172a'; // Slate 900
const accentColor = '#0284c7';  // Light blue 600
const darkGray = '#334155';     // Slate 700
const lightGray = '#64748b';    // Slate 500
const goldColor = '#b45309';    // Amber 700

// Helper: Section Header
function sectionHeader(title) {
  doc.moveDown(0.6);
  doc.fontSize(11).font('Helvetica-Bold').fillColor(accentColor).text(title.toUpperCase(), { characterSpacing: 1 });
  doc.strokeColor('#cbd5e1').lineWidth(0.8).moveTo(40, doc.y).lineTo(555, doc.y).stroke();
  doc.moveDown(0.3);
}

// Header
doc.fontSize(22).font('Helvetica-Bold').fillColor(primaryColor).text('AKASH DAMAHE', { align: 'center' });
doc.fontSize(10).font('Helvetica-Bold').fillColor(accentColor).text('ELECTRICAL ENGINEER  |  DIPLOMA + DEGREE (ACADEMIC TOPPER)', { align: 'center' });
doc.fontSize(8.5).font('Helvetica').fillColor(lightGray).text(
  'Email: akashdamahe@example.com  |  Phone: +91 98765 43210  |  LinkedIn: linkedin.com/in/akashdamahe  |  Portfolio: akashdamahe.onrender.com',
  { align: 'center' }
);

// Summary
sectionHeader('Professional Summary');
doc.fontSize(8.5).font('Helvetica').fillColor(darkGray).text(
  'Driven and academically distinguished Electrical Engineer holding both a Diploma and a Bachelor of Engineering degree in Electrical Engineering with consistent Top Rank honors. Possesses deep technical and practical expertise across High Voltage Substation Operations, Switchgear Protection, Industrial Automation (PLC & SCADA), Renewable Solar PV Engineering, and Embedded Control Systems. Proven record of championship wins in national engineering competitions and high-impact industrial internships.',
  { align: 'justify', lineGap: 1.5 }
);

// Education
sectionHeader('Education & Academic Honors');

// Degree
doc.fontSize(9.5).font('Helvetica-Bold').fillColor(primaryColor).text('Bachelor of Engineering (B.E.) in Electrical Engineering', 40, doc.y, { continued: true });
doc.font('Helvetica-Bold').fillColor(accentColor).text('   |   CGPA: 9.42 / 10.0 (First Class with Distinction)', { align: 'left' });
doc.fontSize(8).font('Helvetica-Oblique').fillColor(darkGray).text('Government College of Engineering / State Technological University  •  2022 – 2025');
doc.fontSize(8).font('Helvetica-Bold').fillColor(goldColor).text('★ Honors: Department Topper & Gold Medalist for Academic Excellence across all graduating semesters.');
doc.fontSize(8).font('Helvetica').fillColor(darkGray).text('Key Coursework: Power System Analysis, High Voltage Switchgear & Protection, Electrical Drives, Advanced Control Systems, Power Electronics.');

doc.moveDown(0.4);

// Diploma
doc.fontSize(9.5).font('Helvetica-Bold').fillColor(primaryColor).text('Diploma in Electrical Engineering', 40, doc.y, { continued: true });
doc.font('Helvetica-Bold').fillColor(accentColor).text('   |   Percentage: 92.80% (First Class with Distinction)', { align: 'left' });
doc.fontSize(8).font('Helvetica-Oblique').fillColor(darkGray).text('Government Polytechnic Institute / State Board of Technical Education  •  2019 – 2022');
doc.fontSize(8).font('Helvetica-Bold').fillColor(goldColor).text('★ Honors: State Board Rank Holder & Polytechnic Institute Topper.');
doc.fontSize(8).font('Helvetica').fillColor(darkGray).text('Key Coursework: Electrical Machines (AC/DC), Transmission & Distribution, Industrial Electronics, PLC & Microcontrollers, Electrical Estimating.');

// Technical Skills
sectionHeader('Technical Skills & Competencies');
doc.fontSize(8.5).font('Helvetica-Bold').fillColor(primaryColor).text('Core Electrical & Power: ', { continued: true });
doc.font('Helvetica').fillColor(darkGray).text('220kV/132kV Substation Equipment, Transformer Testing, Numerical Relay Coordination, Switchgear (SF6/VCB), Fault Analysis, Earthing Grid Design.');

doc.fontSize(8.5).font('Helvetica-Bold').fillColor(primaryColor).text('Automation & Control: ', { continued: true });
doc.font('Helvetica').fillColor(darkGray).text('Siemens TIA Portal, Delta PLC Ladder Logic, Wonderware InTouch SCADA, Variable Frequency Drives (VFDs), Modbus RTU, Sensor Interfacing.');

doc.fontSize(8.5).font('Helvetica-Bold').fillColor(primaryColor).text('Renewable Energy & Solar: ', { continued: true });
doc.font('Helvetica').fillColor(darkGray).text('Solar PV Sizing, MPPT Algorithms (P&O, Incremental Conductance), Grid-Tied Inverters, PVsyst Simulation, Net-Metering.');

doc.fontSize(8.5).font('Helvetica-Bold').fillColor(primaryColor).text('Software & Simulation: ', { continued: true });
doc.font('Helvetica').fillColor(darkGray).text('MATLAB & Simulink, ETAP, AutoCAD Electrical, Proteus VSM, KiCad PCB, Multisim.');

doc.fontSize(8.5).font('Helvetica-Bold').fillColor(primaryColor).text('Programming & Embedded: ', { continued: true });
doc.font('Helvetica').fillColor(darkGray).text('C/C++, Python (Data analysis & FFT), Embedded C, Arduino, ESP32, STM32, Node.js basics.');

// Internships
sectionHeader('Industrial Internships & Field Experience');

doc.fontSize(9).font('Helvetica-Bold').fillColor(primaryColor).text('Electrical Engineering Intern', { continued: true });
doc.font('Helvetica').fillColor(lightGray).text('  |  Sonali Power Equipments Pvt. Ltd.  |  6 Weeks (2023)');
doc.fontSize(8).font('Helvetica').fillColor(darkGray).text('• Inspected and assessed power transformers for operational defects, testing core winding insulation, turns ratio, and oil dielectric BDV.');

doc.moveDown(0.2);

doc.fontSize(9).font('Helvetica-Bold').fillColor(primaryColor).text('Electric Motor Mechanic Trainee', { continued: true });
doc.font('Helvetica').fillColor(lightGray).text('  |  Mai Electricals, Yavatmal  |  1 Month (2025)');
doc.fontSize(8).font('Helvetica').fillColor(darkGray).text('• Carried out routine maintenance, preventive overhaul, stator winding insulation resistance testing, and starter troubleshooting on AC/DC motors.');

doc.moveDown(0.2);

doc.fontSize(9).font('Helvetica-Bold').fillColor(primaryColor).text('Transformer Builder Intern', { continued: true });
doc.font('Helvetica').fillColor(lightGray).text('  |  Highrise Transformers, Nagpur  |  1 Month (2025)');
doc.fontSize(8).font('Helvetica').fillColor(darkGray).text('• Operated vacuum varnish impregnation plant and dielectric oil purification equipment ensuring optimal transformer core-coil insulation.');

// Projects
sectionHeader('Key Engineering Projects');

doc.fontSize(9).font('Helvetica-Bold').fillColor(primaryColor).text('1. Classroom Automation and Student Counter');
doc.fontSize(8).font('Helvetica').fillColor(darkGray).text('• Arduino UNO-based bidirectional student counter and automated classroom lighting/load control to eliminate idle power waste.');
doc.fontSize(8).font('Helvetica').fillColor(darkGray).text('• Tools: Arduino UNO, Bidirectional IR Sensors, 5V/230V Relay Module, 16x2 LCD Display, Embedded C/C++, Proteus.');

doc.moveDown(0.2);

doc.fontSize(9).font('Helvetica-Bold').fillColor(primaryColor).text('2. Dual Axis Solar Panel Tracker');
doc.fontSize(8).font('Helvetica').fillColor(darkGray).text('• Sun-tracking photovoltaic rig with dual-axis servo rotation dynamically facing the sun, maximizing solar irradiance capture and power yield by 30-40%.');
doc.fontSize(8).font('Helvetica').fillColor(darkGray).text('• Tools: Arduino / Microcontroller, LDR Sensor Array, Dual Servo Motors, Solar PV Module, DC-DC Buck Converter, Proteus.');

doc.moveDown(0.2);

doc.fontSize(9).font('Helvetica-Bold').fillColor(primaryColor).text('3. Wireless Charging for Electric Vehicles (On-Road Dynamic Charging)');
doc.fontSize(8).font('Helvetica').fillColor(darkGray).text('• Researched and prototyped a dynamic wireless power transfer (DWPT) system using high-frequency resonant inductive coupling for charging EVs in motion.');
doc.fontSize(8).font('Helvetica').fillColor(darkGray).text('• Tools: Resonant Inductive Coupling, High-Frequency PWM Inverter, Primary/Secondary Ferrite Coils, Power MOSFETs, MATLAB/Simulink.');

// Achievements
sectionHeader('Key Competitions & Honors');
doc.fontSize(8).font('Helvetica').fillColor(darkGray).text('• 1st Prize (Winner) – College Level Technical Project Expo for innovative electrical engineering hardware demonstration.');
doc.fontSize(8).font('Helvetica').fillColor(darkGray).text('• 2nd Prize – Inter-College Extempore Speech Competition on renewable energy advancements and power grid sustainability.');
doc.fontSize(8).font('Helvetica').fillColor(darkGray).text('• Best Research Paper Award – National Conference on Emerging Trends in Electrical Engineering (NCETEE).');
doc.fontSize(8).font('Helvetica').fillColor(darkGray).text('• Academic Department Topper – 2nd Year Diploma in Electrical Engineering with distinction honors.');
doc.fontSize(8).font('Helvetica').fillColor(darkGray).text('• Academic Topper & Gold Medalist – 3rd Year Diploma in Electrical Engineering.');

doc.end();

stream.on('finish', () => {
  console.log(`Successfully generated resume PDF at: ${outputPath}`);
});
