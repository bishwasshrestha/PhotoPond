"use strict";
import mysql from "mysql2";
import * as dotenv from "dotenv";
dotenv.config();

// Create the connection pool.
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "db_photoPond",
  password: "password",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
