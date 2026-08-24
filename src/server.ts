import app from "./app";

import { env } from "./config/env";

import pool, {
    checkDatabaseConnection
} from "./config/database";

const startServer = async () => {
    try {
        await checkDatabaseConnection();

        console.log(
            "Database connection established."
        );

        const server = app.listen(
            env.port,
            () => {
                console.log(
                    `Product Service running on port ${env.port}`
                );
            }
        );

        const shutdown = async (
            signal: string
        ) => {
            console.log(
                `${signal} received. Shutting down gracefully...`
            );

            server.close(async (error) => {
                if (error) {
                    console.error(
                        "Error while closing HTTP server:",
                        error
                    );

                    process.exitCode = 1;
                    return;
                }

                try {
                    await pool.end();

                    console.log(
                        "Database connection pool closed."
                    );

                    process.exitCode = 0;
                } catch (dbError) {
                    console.error(
                        "Error while closing database pool:",
                        dbError
                    );

                    process.exitCode = 1;
                }
            });
        };

        process.once(
            "SIGTERM",
            () => {
                void shutdown("SIGTERM");
            }
        );

        process.once(
            "SIGINT",
            () => {
                void shutdown("SIGINT");
            }
        );
    } catch (error) {
        console.error(
            "Failed to start Product Service:",
            error
        );

        await pool.end();

        process.exitCode = 1;
    }
};

void startServer();