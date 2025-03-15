const express = require('express');
const mysql = require('mysql2');  // Import the MySQL2 package
const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Create a connection to the MySQL server (not specifying the database yet)
const connection = mysql.createConnection({
  host: 'localhost',        // Database host (usually localhost)
  user: 'root',             // MySQL username
  password: '',             // MySQL password (leave empty if no password is set)
});

// Connect to the MySQL server
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL server:', err);
    return;
  }
  console.log('Connected to MySQL server');

  // Check if the database exists and create it if it doesn't
  connection.query('CREATE DATABASE IF NOT EXISTS ngo', (err, result) => {
    if (err) {
      console.error('Error creating database:', err);
      return;
    }
    console.log('Database "ngo" is ready or already exists');
    
    // After creating the database, connect to it
    const db = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'ngo',
    });

    // Connect to the database
    db.connect((err) => {
      if (err) {
        console.error('Error connecting to the database:', err);
        return;
      }
      console.log('Connected to the "ngo" database');
    });

    // Create the "users" table if it doesn't exist
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL
      )
    `;
    db.query(createTableQuery, (err, result) => {
      if (err) {
        console.error('Error creating users table:', err);
        return;
      }
      console.log('Users table is ready or already exists');
    });

    // Define routes
    app.get('/', (req, res) => {
      res.send('Hello, World!');
    });

    // Route to fetch users from the database
    app.get('/users', (req, res) => {
      db.query('SELECT * FROM users', (err, results) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json(results);
      });
    });

    // Route to insert a user into the database
    app.post('/users', (req, res) => {
      const { name, email } = req.body;
      const query = 'INSERT INTO users (name, email) VALUES (?, ?)';
      
      db.query(query, [name, email], (err, result) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: result.insertId, name, email });
      });
    });

    // Start the server after everything is set up
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  });
});
