const express = require('express');
const mysql = require('mysql2');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;
const cors = require('cors');
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

// Middleware to parse JSON requests
app.use(express.json());

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads', 'ngo-documents');
    // Create directory if it doesn't exist
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only .png, .jpg, .jpeg and .pdf format allowed!'));
  }
}).fields([
  { name: 'registrationCertificate', maxCount: 1 },
  { name: 'taxExemptionCertificate', maxCount: 1 },
  { name: 'governmentIdProof', maxCount: 1 },
  { name: 'addressProof', maxCount: 1 }
]);

// Create a connection to MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
});

// Connect to MySQL server
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL server:', err);
    return;
  }
  console.log('Connected to MySQL server');

  // Create the database if it doesn't exist
  connection.query('CREATE DATABASE IF NOT EXISTS ngo', (err, result) => {
    if (err) {
      console.error('Error creating database:', err);
      return;
    }
    console.log('Database "ngo" is ready or already exists');

    // Use the NGO database
    connection.changeUser({ database: 'ngo' }, (err) => {
      if (err) {
        console.error('Error switching to database:', err);
        return;
      }
      console.log('Connected to the "ngo" database');

      // Create the donor_users table
      const createDonorUsersTableQuery = `
        CREATE TABLE IF NOT EXISTS donor_users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;

      // Create the ngo_users table
      const createNGOUsersTableQuery = `
        CREATE TABLE IF NOT EXISTS ngo_users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          organization_name VARCHAR(255) NOT NULL,
          registration_number VARCHAR(100),
          phone VARCHAR(20),
          address TEXT,
          is_verified BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;
      
      // Create the ngo_verification table
      const createVerificationTableQuery = `
        CREATE TABLE IF NOT EXISTS ngo_verification (
          id INT AUTO_INCREMENT PRIMARY KEY,
          ngo_id INT NOT NULL,
          registration_certificate VARCHAR(500) NOT NULL,
          tax_exemption_certificate VARCHAR(500),
          government_id_proof VARCHAR(500) NOT NULL,
          address_proof VARCHAR(500) NOT NULL,
          status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
          submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (ngo_id) REFERENCES ngo_users(id)
        )
      `;

      connection.query(createDonorUsersTableQuery, (err, result) => {
        if (err) {
          console.error('Error creating donor_users table:', err);
          return;
        }
        console.log('Donor users table is ready');
      });

      connection.query(createNGOUsersTableQuery, (err, result) => {
        if (err) {
          console.error('Error creating ngo_users table:', err);
          return;
        }
        console.log('NGO users table is ready');
      });

      connection.query(createVerificationTableQuery, (err, result) => {
        if (err) {
          console.error('Error creating ngo_verification table:', err);
          return;
        }
        console.log('NGO verification table is ready');
      });

      // Create campaigns table
      const createCampaignsTableQuery = `
        CREATE TABLE IF NOT EXISTS campaigns (
          id INT AUTO_INCREMENT PRIMARY KEY,
          ngo_id INT NOT NULL,
          title VARCHAR(255) NOT NULL,
          description TEXT NOT NULL,
          target_amount DECIMAL(10, 2) NOT NULL,
          start_date DATE NOT NULL,
          end_date DATE NOT NULL,
          beneficiaries TEXT,
          impact_details TEXT,
          media_urls JSON,
          bank_details JSON NOT NULL,
          transparency_statement TEXT,
          status ENUM('active', 'completed', 'cancelled') DEFAULT 'active',
          current_amount DECIMAL(10, 2) DEFAULT 0.00,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (ngo_id) REFERENCES ngo_users(id)
        )
      `;

      // Create expenses table
      const createExpensesTableQuery = `
        CREATE TABLE IF NOT EXISTS expenses (
          id INT AUTO_INCREMENT PRIMARY KEY,
          campaign_id INT NOT NULL,
          amount DECIMAL(10, 2) NOT NULL,
          description TEXT NOT NULL,
          category VARCHAR(100) NOT NULL,
          receipt_url VARCHAR(500),
          expense_date DATE NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (campaign_id) REFERENCES campaigns(id)
        )
      `;

      // Create fund_allocations table
      const createFundAllocationsTableQuery = `
        CREATE TABLE IF NOT EXISTS fund_allocations (
          id INT AUTO_INCREMENT PRIMARY KEY,
          campaign_id INT NOT NULL,
          amount DECIMAL(10, 2) NOT NULL,
          purpose VARCHAR(255) NOT NULL,
          allocation_date DATE NOT NULL,
          status ENUM('planned', 'allocated', 'spent') DEFAULT 'planned',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (campaign_id) REFERENCES campaigns(id)
        )
      `;

      // Execute the new table creation queries
      connection.query(createCampaignsTableQuery, (err, result) => {
        if (err) {
          console.error('Error creating campaigns table:', err);
          return;
        }
        console.log('Campaigns table is ready');
      });

      connection.query(createExpensesTableQuery, (err, result) => {
        if (err) {
          console.error('Error creating expenses table:', err);
          return;
        }
        console.log('Expenses table is ready');
      });

      connection.query(createFundAllocationsTableQuery, (err, result) => {
        if (err) {
          console.error('Error creating fund_allocations table:', err);
          return;
        }
        console.log('Fund allocations table is ready');
      });
    });
  });
});

// NGO Registration endpoint
app.post('/api/ngo/register', async (req, res) => {
  const { name, email, password, organizationName, registrationNumber, phone, address } = req.body;

  const query = `
    INSERT INTO ngo_users 
    (name, email, password, organization_name, registration_number, phone, address)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  connection.query(
    query,
    [name, email, password, organizationName, registrationNumber, phone, address],
    (err, result) => {
      if (err) {
        console.error('Error registering NGO:', err);
        return res.status(500).json({ error: 'Failed to register NGO' });
      }
      res.status(201).json({
        message: 'NGO registered successfully',
        ngoId: result.insertId
      });
    }
  );
});

// NGO Login endpoint
app.post('/api/ngo/login', (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt for email:', email);

  const query = `
    SELECT id, name, email, organization_name, is_verified 
    FROM ngo_users 
    WHERE email = ? AND password = ?
  `;

  connection.query(query, [email, password], (err, results) => {
    if (err) {
      console.error('Login query error:', err);
      return res.status(500).json({ error: 'Login failed' });
    }

    if (results.length === 0) {
      console.log('No user found with provided credentials');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const ngo = results[0];
    console.log('NGO logged in successfully:', ngo);
    res.json({
      id: ngo.id,
      name: ngo.name,
      email: ngo.email,
      organizationName: ngo.organization_name,
      isVerified: ngo.is_verified
    });
  });
});

// ✅ Donor Registration Route
app.post('/api/donorregister', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const insertQuery = "INSERT INTO donor_users (name, email, password) VALUES (?, ?, ?)";
  connection.query(insertQuery, [name, email, password], (err, result) => {
    if (err) {
      console.error('Error registering donor:', err);
      return res.status(500).json({ message: "Error registering donor", error: err });
    }

    res.status(201).json({ message: "Registration successful", donorId: result.insertId });
  });
});

app.post('/api/donorlogin', (req, res) => {
  const { email, password } = req.body;
  console.log(`${email}, ${password}`);

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const selectQuery = "SELECT * FROM donor_users WHERE email = ? AND password = ?";
  connection.query(selectQuery, [email, password], (err, results) => {
    if (err) {
      console.error('Error logging in donor:', err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.status(200).json({ message: "Login successful", user: results[0] });
  });
});

// NGO Verification endpoint
app.post('/api/ngo/verify', (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error('File upload error:', err);
      return res.status(400).json({ 
        error: err.message || 'Error uploading files'
      });
    }

    try {
      const ngoId = req.body.ngoId;
      if (!ngoId) {
        return res.status(400).json({ error: 'NGO ID is required' });
      }

      // Check if files were uploaded
      if (!req.files || !req.files.registrationCertificate || 
          !req.files.governmentIdProof || !req.files.addressProof) {
        return res.status(400).json({ 
          error: 'Missing required documents' 
        });
      }

      const documents = {
        registration_certificate: req.files.registrationCertificate[0].path,
        tax_exemption_certificate: req.files.taxExemptionCertificate ? 
          req.files.taxExemptionCertificate[0].path : null,
        government_id_proof: req.files.governmentIdProof[0].path,
        address_proof: req.files.addressProof[0].path
      };

      // First check if NGO exists
      const checkNgoQuery = 'SELECT id FROM ngo_users WHERE id = ?';
      connection.query(checkNgoQuery, [ngoId], (err, results) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ 
            error: 'Failed to verify NGO' 
          });
        }

        if (results.length === 0) {
          return res.status(404).json({ 
            error: 'NGO not found' 
          });
        }

        // Insert verification documents
        const insertQuery = `
          INSERT INTO ngo_verification 
          (ngo_id, registration_certificate, tax_exemption_certificate, 
           government_id_proof, address_proof, status)
          VALUES (?, ?, ?, ?, ?, 'pending')
        `;

        connection.query(
          insertQuery,
          [ngoId, documents.registration_certificate, 
           documents.tax_exemption_certificate,
           documents.government_id_proof, 
           documents.address_proof],
          (err, result) => {
            if (err) {
              console.error('Database error:', err);
              return res.status(500).json({ 
                error: 'Failed to save verification documents' 
              });
            }

            res.status(201).json({
              message: 'Documents uploaded successfully',
              verificationId: result.insertId
            });
          }
        );
      });
    } catch (error) {
      console.error('Server error:', error);
      res.status(500).json({ 
        error: 'Failed to process verification request' 
      });
    }
  });
});

// Get NGO Verification Status
app.get('/api/ngo/verification-status/:ngoId', (req, res) => {
  const ngoId = req.params.ngoId;
  console.log('Checking verification status for NGO ID:', ngoId);

  const query = `
    SELECT nu.is_verified, nv.status, nv.submitted_at
    FROM ngo_users nu
    LEFT JOIN ngo_verification nv ON nu.id = nv.ngo_id AND nv.id = (
      SELECT MAX(id) FROM ngo_verification WHERE ngo_id = ?
    )
    WHERE nu.id = ?
  `;

  connection.query(query, [ngoId, ngoId], (err, results) => {
    if (err) {
      console.error('Verification status query error:', err);
      return res.status(500).json({ error: 'Failed to fetch verification status' });
    }

    console.log('Verification status results:', results);

    if (results.length === 0) {
      return res.status(404).json({ error: 'NGO not found' });
    }

    // Even if there's no verification record, we'll still have the NGO's verified status
    return res.json({
      status: results[0].status || null,
      submitted_at: results[0].submitted_at || null,
      isVerified: results[0].is_verified || false
    });
  });
});

// Campaign Management Endpoints
app.post('/api/campaigns', (req, res) => {
  const {
    ngoId, title, description, targetAmount, startDate, endDate,
    beneficiaries, impactDetails, mediaUrls, bankDetails, transparencyStatement
  } = req.body;

  console.log('Received campaign creation request with data:', JSON.stringify({
    ngoId, title, description, targetAmount, startDate, endDate,
    beneficiaries, impactDetails, mediaUrls, bankDetails, transparencyStatement
  }, null, 2));

  // Validate required fields
  if (!ngoId) {
    console.error('Missing NGO ID');
    return res.status(400).json({ error: 'NGO ID is required' });
  }

  if (!title || !description || !targetAmount || !startDate || !endDate) {
    console.error('Missing required campaign fields:', { title, description, targetAmount, startDate, endDate });
    return res.status(400).json({ error: 'Missing required campaign fields' });
  }

  if (!bankDetails || !bankDetails.accountName || !bankDetails.accountNumber || 
      !bankDetails.bankName || !bankDetails.ifscCode) {
    console.error('Missing or invalid bank details:', bankDetails);
    return res.status(400).json({ error: 'Complete bank details are required' });
  }

  // Validate NGO exists
  const checkNgoQuery = 'SELECT id FROM ngo_users WHERE id = ?';
  connection.query(checkNgoQuery, [ngoId], (err, results) => {
    if (err) {
      console.error('Error checking NGO existence:', err);
      return res.status(500).json({ 
        error: 'Database error',
        details: 'Failed to verify NGO',
        message: err.message
      });
    }

    if (results.length === 0) {
      console.error('NGO not found:', ngoId);
      return res.status(404).json({ error: 'NGO not found' });
    }

    // Convert and validate targetAmount
    let parsedTargetAmount;
    try {
      parsedTargetAmount = parseFloat(targetAmount);
      if (isNaN(parsedTargetAmount) || parsedTargetAmount <= 0) {
        console.error('Invalid target amount:', targetAmount);
        return res.status(400).json({ error: 'Invalid target amount' });
      }
    } catch (error) {
      console.error('Error parsing target amount:', error);
      return res.status(400).json({ 
        error: 'Invalid target amount format',
        details: error.message 
      });
    }

    // Validate and format dates
    try {
      const formattedStartDate = new Date(startDate).toISOString().split('T')[0];
      const formattedEndDate = new Date(endDate).toISOString().split('T')[0];
      const today = new Date().toISOString().split('T')[0];

      if (formattedStartDate < today) {
        console.error('Start date is in the past:', { formattedStartDate, today });
        return res.status(400).json({ error: 'Start date cannot be in the past' });
      }

      if (formattedEndDate <= formattedStartDate) {
        console.error('Invalid date range:', { formattedStartDate, formattedEndDate });
        return res.status(400).json({ error: 'End date must be after start date' });
      }

      // Validate bank details format
      const stringifiedBankDetails = JSON.stringify(bankDetails);
      if (!stringifiedBankDetails) {
        console.error('Failed to stringify bank details:', bankDetails);
        return res.status(400).json({ error: 'Invalid bank details format' });
      }

      // Prepare media URLs
      const stringifiedMediaUrls = JSON.stringify(mediaUrls || []);
      if (!stringifiedMediaUrls) {
        console.error('Failed to stringify media URLs:', mediaUrls);
        return res.status(400).json({ error: 'Invalid media URLs format' });
      }

      // Insert campaign with detailed error handling
      const query = `
        INSERT INTO campaigns 
        (ngo_id, title, description, target_amount, start_date, end_date,
         beneficiaries, impact_details, media_urls, bank_details, transparency_statement)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const params = [
        ngoId, 
        title, 
        description, 
        parsedTargetAmount, 
        formattedStartDate, 
        formattedEndDate,
        beneficiaries || null, 
        impactDetails || null, 
        stringifiedMediaUrls,
        stringifiedBankDetails, 
        transparencyStatement || null
      ];

      console.log('Executing insert query with params:', JSON.stringify(params, null, 2));

      connection.query(query, params, (err, result) => {
        if (err) {
          console.error('Database error creating campaign:', {
            error: err,
            message: err.message,
            code: err.code,
            sqlMessage: err.sqlMessage,
            sql: err.sql
          });
          return res.status(500).json({ 
            error: 'Failed to create campaign',
            details: err.message,
            sqlMessage: err.sqlMessage
          });
        }
        console.log('Campaign created successfully:', result);
        res.status(201).json({
          message: 'Campaign created successfully',
          campaignId: result.insertId
        });
      });
    } catch (error) {
      console.error('Error processing campaign data:', error);
      return res.status(500).json({ 
        error: 'Server error processing campaign data',
        details: error.message 
      });
    }
  });
});

// Get NGO's Campaigns
app.get('/api/campaigns/ngo/:ngoId', (req, res) => {
  const ngoId = req.params.ngoId;

  const query = `
    SELECT * FROM campaigns 
    WHERE ngo_id = ?
    ORDER BY created_at DESC
  `;

  connection.query(query, [ngoId], (err, results) => {
    if (err) {
      console.error('Error fetching campaigns:', err);
      return res.status(500).json({ error: 'Failed to fetch campaigns' });
    }
    res.json(results);
  });
});

// Add Expense
app.post('/api/expenses', (req, res) => {
  const {
    campaignId, amount, description, category,
    receiptUrl, expenseDate
  } = req.body;

  const query = `
    INSERT INTO expenses 
    (campaign_id, amount, description, category, receipt_url, expense_date)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  connection.query(
    query,
    [campaignId, amount, description, category, receiptUrl, expenseDate],
    (err, result) => {
      if (err) {
        console.error('Error creating expense:', err);
        return res.status(500).json({ error: 'Failed to create expense' });
      }
      res.status(201).json({
        message: 'Expense recorded successfully',
        expenseId: result.insertId
      });
    }
  );
});

// Get Campaign Expenses
app.get('/api/expenses/campaign/:campaignId', (req, res) => {
  const campaignId = req.params.campaignId;

  const query = `
    SELECT * FROM expenses 
    WHERE campaign_id = ?
    ORDER BY expense_date DESC
  `;

  connection.query(query, [campaignId], (err, results) => {
    if (err) {
      console.error('Error fetching expenses:', err);
      return res.status(500).json({ error: 'Failed to fetch expenses' });
    }
    res.json(results);
  });
});

// Add Fund Allocation
app.post('/api/fund-allocations', (req, res) => {
  const {
    campaignId, amount, purpose, allocationDate,
    status
  } = req.body;

  const query = `
    INSERT INTO fund_allocations 
    (campaign_id, amount, purpose, allocation_date, status)
    VALUES (?, ?, ?, ?, ?)
  `;

  connection.query(
    query,
    [campaignId, amount, purpose, allocationDate, status],
    (err, result) => {
      if (err) {
        console.error('Error creating fund allocation:', err);
        return res.status(500).json({ error: 'Failed to create fund allocation' });
      }
      res.status(201).json({
        message: 'Fund allocation created successfully',
        allocationId: result.insertId
      });
    }
  );
});

// Get Campaign Fund Allocations
app.get('/api/fund-allocations/campaign/:campaignId', (req, res) => {
  const campaignId = req.params.campaignId;

  const query = `
    SELECT * FROM fund_allocations 
    WHERE campaign_id = ?
    ORDER BY allocation_date DESC
  `;

  connection.query(query, [campaignId], (err, results) => {
    if (err) {
      console.error('Error fetching fund allocations:', err);
      return res.status(500).json({ error: 'Failed to fetch fund allocations' });
    }
    res.json(results);
  });
});

// Get Campaign Summary with Expenses and Allocations
app.get('/api/campaigns/:campaignId/summary', (req, res) => {
  const campaignId = req.params.campaignId;

  const campaignQuery = `
    SELECT c.*, 
           COALESCE(SUM(e.amount), 0) as total_expenses,
           COALESCE(SUM(CASE WHEN fa.status = 'allocated' THEN fa.amount ELSE 0 END), 0) as allocated_funds
    FROM campaigns c
    LEFT JOIN expenses e ON c.id = e.campaign_id
    LEFT JOIN fund_allocations fa ON c.id = fa.campaign_id
    WHERE c.id = ?
    GROUP BY c.id
  `;

  connection.query(campaignQuery, [campaignId], (err, results) => {
    if (err) {
      console.error('Error fetching campaign summary:', err);
      return res.status(500).json({ error: 'Failed to fetch campaign summary' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    res.json(results[0]);
  });
});

// Get Verified NGOs with search
app.get('/api/ngos/verified', (req, res) => {
  const searchTerm = req.query.search || '';
  
  const query = `
    SELECT 
      nu.id,
      nu.name,
      nu.email,
      nu.organization_name,
      nu.registration_number,
      nu.phone,
      nu.address,
      nu.is_verified,
      COUNT(DISTINCT c.id) as active_campaigns,
      COALESCE(SUM(c.current_amount), 0) as total_funds_raised
    FROM ngo_users nu
    LEFT JOIN campaigns c ON nu.id = c.ngo_id AND c.status = 'active'
    WHERE (
      LOWER(nu.organization_name) LIKE CONCAT('%', LOWER(?), '%')
      OR LOWER(nu.name) LIKE CONCAT('%', LOWER(?), '%')
    )
    GROUP BY nu.id
    ORDER BY nu.organization_name ASC
  `;

  connection.query(query, [searchTerm, searchTerm], (err, results) => {
    if (err) {
      console.error('Error fetching NGOs:', err);
      return res.status(500).json({ error: 'Failed to fetch NGOs' });
    }
    console.log('Fetched NGOs:', results); // Add logging
    res.json(results);
  });
});

// Get NGO Details
app.get('/api/ngos/:ngoId', (req, res) => {
  const ngoId = req.params.ngoId;
  console.log('Fetching details for NGO ID:', ngoId);

  // First check if the NGO exists
  const checkNgoQuery = 'SELECT id FROM ngo_users WHERE id = ?';
  connection.query(checkNgoQuery, [ngoId], (err, checkResults) => {
    if (err) {
      console.error('Error checking NGO existence:', err);
      return res.status(500).json({ 
        error: 'Database error', 
        details: err.message,
        sqlMessage: err.sqlMessage,
        code: err.code 
      });
    }

    if (checkResults.length === 0) {
      console.log('NGO not found with ID:', ngoId);
      return res.status(404).json({ error: 'NGO not found' });
    }

    // If NGO exists, fetch full details including campaigns
    const query = `
      SELECT 
        nu.id,
        nu.name,
        nu.email,
        nu.organization_name,
        nu.registration_number,
        nu.phone,
        nu.address,
        nu.is_verified,
        COUNT(DISTINCT CASE WHEN c.status = 'active' THEN c.id END) as active_campaigns,
        COUNT(DISTINCT c.id) as total_campaigns,
        COALESCE(SUM(c.current_amount), 0) as total_funds_raised
      FROM ngo_users nu
      LEFT JOIN campaigns c ON nu.id = c.ngo_id
      WHERE nu.id = ?
      GROUP BY 
        nu.id, 
        nu.name, 
        nu.email, 
        nu.organization_name, 
        nu.registration_number, 
        nu.phone, 
        nu.address, 
        nu.is_verified
    `;

    console.log('Executing NGO details query:', query);
    console.log('With parameters:', [ngoId]);

    // Execute NGO details query
    connection.query(query, [ngoId], (err, ngoResults) => {
      if (err) {
        console.error('Error fetching NGO details:', {
          error: err,
          message: err.message,
          sqlMessage: err.sqlMessage,
          code: err.code,
          query: query,
          parameters: [ngoId]
        });
        return res.status(500).json({ 
          error: 'Failed to fetch NGO details', 
          details: err.message,
          sqlMessage: err.sqlMessage,
          code: err.code 
        });
      }

      if (ngoResults.length === 0) {
        console.log('No results found for NGO ID:', ngoId);
        return res.status(404).json({ error: 'NGO not found' });
      }

      // Remove sensitive information
      const ngo = ngoResults[0];
      delete ngo.password;

      // Fetch campaigns for this NGO
      const campaignsQuery = `
        SELECT 
          id,
          title,
          description,
          target_amount,
          current_amount,
          start_date,
          end_date,
          status,
          beneficiaries,
          impact_details,
          created_at
        FROM campaigns 
        WHERE ngo_id = ?
        ORDER BY created_at DESC
      `;

      connection.query(campaignsQuery, [ngoId], (err, campaignResults) => {
        if (err) {
          console.error('Error fetching NGO campaigns:', err);
          return res.status(500).json({ 
            error: 'Failed to fetch NGO campaigns', 
            details: err.message 
          });
        }

        // Add campaigns to NGO data
        ngo.campaigns = campaignResults;
        
        console.log('Successfully fetched NGO details with campaigns:', ngo);
        res.json(ngo);
      });
    });
  });
});

// Create donations table if it doesn't exist
const createDonationsTableQuery = `
  CREATE TABLE IF NOT EXISTS donations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    campaign_id INT NOT NULL,
    donor_id INT,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    transaction_id VARCHAR(100),
    is_anonymous BOOLEAN DEFAULT FALSE,
    status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id),
    FOREIGN KEY (donor_id) REFERENCES donor_users(id)
  )
`;

connection.query(createDonationsTableQuery, (err, result) => {
  if (err) {
    console.error('Error creating donations table:', err);
    return;
  }
  console.log('Donations table is ready');
});

// Process Donation
app.post('/api/donations', async (req, res) => {
  const { campaignId, amount, paymentMethod, isAnonymous, donorId } = req.body;

  // Validate required fields
  if (!campaignId || !amount || !paymentMethod) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Start a transaction
  connection.beginTransaction(async (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to start transaction' });
    }

    try {
      // Create donation record
      const createDonationQuery = `
        INSERT INTO donations 
        (campaign_id, donor_id, amount, payment_method, is_anonymous, status)
        VALUES (?, ?, ?, ?, ?, 'pending')
      `;

      const [donationResult] = await connection.promise().query(
        createDonationQuery,
        [campaignId, donorId, amount, paymentMethod, isAnonymous]
      );

      // Update campaign amount
      const updateCampaignQuery = `
        UPDATE campaigns 
        SET current_amount = current_amount + ?
        WHERE id = ?
      `;

      await connection.promise().query(updateCampaignQuery, [amount, campaignId]);

      // Commit transaction
      connection.commit((err) => {
        if (err) {
          return connection.rollback(() => {
            res.status(500).json({ error: 'Failed to process donation' });
          });
        }

        res.status(201).json({
          message: 'Donation processed successfully',
          donationId: donationResult.insertId
        });
      });
    } catch (error) {
      return connection.rollback(() => {
        res.status(500).json({ error: 'Failed to process donation' });
      });
    }
  });
});

// Get Donor's Donation History
app.get('/api/donations/donor/:donorId', (req, res) => {
  const donorId = req.params.donorId;

  const query = `
    SELECT 
      d.*,
      c.title as campaign_title,
      nu.organization_name as ngo_name
    FROM donations d
    JOIN campaigns c ON d.campaign_id = c.id
    JOIN ngo_users nu ON c.ngo_id = nu.id
    WHERE d.donor_id = ?
    ORDER BY d.created_at DESC
  `;

  connection.query(query, [donorId], (err, results) => {
    if (err) {
      console.error('Error fetching donation history:', err);
      return res.status(500).json({ error: 'Failed to fetch donation history' });
    }
    res.json(results);
  });
});

// Get Campaign's Donations
app.get('/api/donations/campaign/:campaignId', (req, res) => {
  const campaignId = req.params.campaignId;
  const showAnonymous = req.query.showAnonymous === 'true';

  const query = `
    SELECT 
      d.id,
      d.amount,
      d.is_anonymous,
      d.created_at,
      CASE 
        WHEN d.is_anonymous = 0 THEN du.name
        ELSE 'Anonymous Donor'
      END as donor_name
    FROM donations d
    LEFT JOIN donor_users du ON d.donor_id = du.id
    WHERE d.campaign_id = ? AND d.status = 'completed'
    ${showAnonymous ? '' : 'AND d.is_anonymous = 0'}
    ORDER BY d.created_at DESC
  `;

  connection.query(query, [campaignId], (err, results) => {
    if (err) {
      console.error('Error fetching campaign donations:', err);
      return res.status(500).json({ error: 'Failed to fetch donations' });
    }
    res.json(results);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
