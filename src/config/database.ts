import mysql from "mysql2/promise";

import { env } from "./env";

const pool = mysql.createPool({
    host: env.db.host,
    port: env.db.port,
    user: env.db.user,
    password: env.db.password,
    database: env.db.name,
    decimalNumbers: true,
    waitForConnections: true,
    connectionLimit:
        env.db.connectionLimit,
    queueLimit: 0
});

export const checkDatabaseConnection =
    async (): Promise<void> => {
        const connection =
            await pool.getConnection();

        try {
            await connection.ping();
        } finally {
            connection.release();
        }
    };

export default pool;