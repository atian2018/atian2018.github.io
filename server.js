const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const puppeteer = require('puppeteer');
const { body, validationResult } = require('express-validator');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Rate limiting (Usability Heuristic 5: Error Prevention)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

app.use(compression());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files from React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Database setup
const db = new sqlite3.Database('./patient_data.db');

// Initialize database tables
db.serialize(() => {
  // Users table for authentication
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'researcher',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME,
    is_active BOOLEAN DEFAULT 1
  )`);

  // Patient records table
  db.run(`CREATE TABLE IF NOT EXISTS patient_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    date_of_birth DATE,
    gender TEXT,
    diagnosis TEXT,
    treatment_plan TEXT,
    notes TEXT,
    created_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    sync_status TEXT DEFAULT 'pending',
    redcap_record_id TEXT,
    FOREIGN KEY (created_by) REFERENCES users (id)
  )`);

  // Audit log for sync attempts (Usability Heuristic 6: Recognition rather than recall)
  db.run(`CREATE TABLE IF NOT EXISTS sync_audit_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    record_id INTEGER,
    user_id INTEGER,
    sync_attempted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    sync_status TEXT NOT NULL,
    error_message TEXT,
    redcap_response TEXT,
    FOREIGN KEY (record_id) REFERENCES patient_records (id),
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`);

  // Password reset tokens
  db.run(`CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    token TEXT UNIQUE NOT NULL,
    expires_at DATETIME NOT NULL,
    used BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`);

  // Create default users
  const hashedAdminPassword = bcrypt.hashSync('admin123', 10);
  const hashedResearcherPassword = bcrypt.hashSync('researcher123', 10);
  
  db.run(`INSERT OR IGNORE INTO users (email, password, role) VALUES (?, ?, ?)`, 
    ['admin@clinic.com', hashedAdminPassword, 'administrator']);
    
  db.run(`INSERT OR IGNORE INTO users (email, password, role) VALUES (?, ?, ?)`, 
    ['researcher@clinic.com', hashedResearcherPassword, 'researcher']);
});

// JWT secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Email configuration (for password reset)
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Role-based access control middleware
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    next();
  };
};

// API Routes

// Authentication routes
app.post('/api/auth/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    db.get('SELECT * FROM users WHERE email = ? AND is_active = 1', [email], async (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Update last login
      db.run('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        }
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get current user info
app.get('/api/auth/me', authenticateToken, (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role
    }
  });
});

// Patient records routes
app.get('/api/patients', authenticateToken, (req, res) => {
  const query = `
    SELECT pr.*, u.email as created_by_email 
    FROM patient_records pr 
    LEFT JOIN users u ON pr.created_by = u.id 
    ORDER BY pr.created_at DESC
  `;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

app.post('/api/patients', authenticateToken, [
  body('patient_id').notEmpty(),
  body('first_name').notEmpty(),
  body('last_name').notEmpty()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { patient_id, first_name, last_name, date_of_birth, gender, diagnosis, treatment_plan, notes } = req.body;

  const query = `
    INSERT INTO patient_records 
    (patient_id, first_name, last_name, date_of_birth, gender, diagnosis, treatment_plan, notes, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(query, [patient_id, first_name, last_name, date_of_birth, gender, diagnosis, treatment_plan, notes, req.user.id], function(err) {
    if (err) {
      if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return res.status(400).json({ error: 'Patient ID already exists' });
      }
      return res.status(500).json({ error: 'Database error' });
    }

    res.json({ id: this.lastID, message: 'Patient record created successfully' });
  });
});

// Sync to REDCap (simulated)
app.post('/api/patients/:id/sync', authenticateToken, (req, res) => {
  const { id } = req.params;
  
  // Simulate REDCap sync
  setTimeout(() => {
    const success = Math.random() > 0.1; // 90% success rate for demo
    
    if (success) {
      db.run('UPDATE patient_records SET sync_status = ?, redcap_record_id = ? WHERE id = ?', 
        ['synced', `REDCAP_${Date.now()}`, id]);
      
      db.run('INSERT INTO sync_audit_log (record_id, user_id, sync_status, redcap_response) VALUES (?, ?, ?, ?)',
        [id, req.user.id, 'success', 'Record successfully synced to REDCap']);
      
      res.json({ message: 'Successfully synced to REDCap', redcap_id: `REDCAP_${Date.now()}` });
    } else {
      db.run('INSERT INTO sync_audit_log (record_id, user_id, sync_status, error_message) VALUES (?, ?, ?, ?)',
        [id, req.user.id, 'failed', 'Network timeout']);
      
      res.status(500).json({ error: 'Sync failed - will retry later' });
    }
  }, 2000);
});

// Export routes
app.get('/api/export/pdf/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM patient_records WHERE id = ?', [id], async (err, record) => {
    if (err || !record) {
      return res.status(404).json({ error: 'Record not found' });
    }

    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      
      const html = `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; }
              .header { border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
              .field { margin-bottom: 15px; }
              .label { font-weight: bold; color: #333; }
              .value { margin-top: 5px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Patient Medical Record</h1>
              <p>Generated: ${new Date().toLocaleDateString()}</p>
            </div>
            
            <div class="field">
              <div class="label">Patient ID:</div>
              <div class="value">${record.patient_id}</div>
            </div>
            
            <div class="field">
              <div class="label">Name:</div>
              <div class="value">${record.first_name} ${record.last_name}</div>
            </div>
            
            <div class="field">
              <div class="label">Date of Birth:</div>
              <div class="value">${record.date_of_birth || 'Not provided'}</div>
            </div>
            
            <div class="field">
              <div class="label">Gender:</div>
              <div class="value">${record.gender || 'Not provided'}</div>
            </div>
            
            <div class="field">
              <div class="label">Diagnosis:</div>
              <div class="value">${record.diagnosis || 'Not provided'}</div>
            </div>
            
            <div class="field">
              <div class="label">Treatment Plan:</div>
              <div class="value">${record.treatment_plan || 'Not provided'}</div>
            </div>
            
            <div class="field">
              <div class="label">Notes:</div>
              <div class="value">${record.notes || 'No additional notes'}</div>
            </div>
            
            <div class="field">
              <div class="label">Sync Status:</div>
              <div class="value">${record.sync_status}</div>
            </div>
          </body>
        </html>
      `;

      await page.setContent(html);
      const pdf = await page.pdf({ format: 'A4' });
      await browser.close();

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="patient_${record.patient_id}.pdf"`);
      res.send(pdf);
    } catch (error) {
      res.status(500).json({ error: 'PDF generation failed' });
    }
  });
});

app.get('/api/export/csv', authenticateToken, (req, res) => {
  const query = 'SELECT * FROM patient_records ORDER BY created_at DESC';
  
  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    // Convert to CSV
    if (rows.length === 0) {
      return res.status(404).json({ error: 'No records found' });
    }

    const headers = Object.keys(rows[0]).join(',');
    const csvContent = [
      headers,
      ...rows.map(row => Object.values(row).map(val => `"${val || ''}"`).join(','))
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="all_patient_records.csv"');
    res.send(csvContent);
  });
});

// Admin routes (role-based access)
app.get('/api/admin/users', authenticateToken, requireRole(['administrator']), (req, res) => {
  db.all('SELECT id, email, role, created_at, last_login, is_active FROM users', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

app.post('/api/admin/users', authenticateToken, requireRole(['administrator']), [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('role').isIn(['researcher', 'administrator'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, role } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    db.run('INSERT INTO users (email, password, role) VALUES (?, ?, ?)', 
      [email, hashedPassword, role], function(err) {
        if (err) {
          if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            return res.status(400).json({ error: 'Email already exists' });
          }
          return res.status(500).json({ error: 'Database error' });
        }

        res.json({ id: this.lastID, message: 'User created successfully' });
      });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/admin/users/:id/toggle-status', authenticateToken, requireRole(['administrator']), (req, res) => {
  const { id } = req.params;
  const { is_active } = req.body;

  db.run('UPDATE users SET is_active = ? WHERE id = ?', [is_active ? 1 : 0, id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User status updated successfully' });
  });
});

// Catch all handler: send back React's index.html file for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Admin login: admin@clinic.com / admin123`);
});

module.exports = app;
