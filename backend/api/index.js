import express from "express";
import cors from "cors";
import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config(); 

const app = express();

app.use(cors());

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT
});

connection.connect((error) => {
  if (error) {
    console.error('Error connecting to MySQL database:', error);
  } else {
    console.log('Connected to MySQL database!');
  }
});

app.get("/api", (req, res) => {
    res.json({ name: "Hana" }); 
});

app.get("/api/branches", (req, res) => {
    connection.query('SELECT * FROM Branch', (error, results) => {
      if (error) {
        console.error('Error fetching branches:', error);
        res.status(500).json({ error: 'Error fetching branches' });
      } else {
        console.log('Branches:', results);
        res.json(results);
      }
    });
});

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Server ready on port ${PORT}.`));
