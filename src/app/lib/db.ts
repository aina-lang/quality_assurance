// lib/database.ts - Configuration de la base de données
import mysql from 'mysql2/promise';

export const dbConfig = {
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'quality_assurance',
    port: parseInt(process.env.DB_PORT || '3306'),
};


// Pool de connexions pour de meilleures performances
export const pool = mysql.createPool({
    ...dbConfig,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});




