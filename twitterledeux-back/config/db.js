require('dotenv').config();
const mysql = require('mysql2');

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

db.getConnection((err, connection) => {
    if (err) {
        console.error("❌ Erreur de connexion à MySQL:", err);
        return;
    }
    console.log("✅ Connecté à MySQL !");
    connection.release();
});

module.exports = db;
