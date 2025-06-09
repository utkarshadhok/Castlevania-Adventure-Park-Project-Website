const mysql = require('mysql2/promise');
const fs = require('fs').promises;
require('dotenv').config();

async function setupDatabase() {
    let connection;

    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD
        });

        await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'castlevania'}`);
        await connection.query(`USE ${process.env.DB_NAME || 'castlevania'}`);

        const sql = await fs.readFile('data.sql', 'utf8');
        const statements = sql.split(';').filter(stmt => stmt.trim());

        for (let statement of statements) {
            if (statement.trim()) {
                await connection.query(statement);
            }
        }

        console.log('Database setup completed successfully!');

    } catch (error) {
        console.error('Error setting up database:', error);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

setupDatabase(); 