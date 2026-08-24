import fs from "fs";
import os from "os";
import path from "path";

import {
    acquireMigrationLock,
    calculateMigrationChecksum,
    executeMigration,
    loadMigrationFiles,
    releaseMigrationLock,
    validateMigrationHistory
} from "../../../scripts/migration.utils";

describe("migration utilities", () => {
    it("generates a stable SHA-256 migration checksum", () => {
        expect(
            calculateMigrationChecksum(
                "CREATE TABLE example (id INT);"
            )
        ).toBe(
            "2ace808a8e7f00bda1e6e1697199f8cee4f3b52e738bc1805dc2527ebdba0b00"
        );
    });

    it("rejects a modified executed migration", () => {
        const migrations = [
            {
                name: "001_example.sql",
                sql: "SELECT 1",
                checksum: "current-checksum"
            }
        ];

        expect(() =>
            validateMigrationHistory(migrations, [
                {
                    migration_name: "001_example.sql",
                    checksum: "original-checksum"
                }
            ])
        ).toThrow("Migration modified");
    });

    it("rejects recorded migrations whose files are missing", () => {
        expect(() =>
            validateMigrationHistory([], [
                {
                    migration_name: "001_missing.sql",
                    checksum: "checksum"
                }
            ])
        ).toThrow("Migration history is inconsistent");
    });

    it("acquires and releases the named migration lock", async () => {
        const connection = {
            execute: jest
                .fn()
                .mockResolvedValueOnce([
                    [{ lock_acquired: 1 }],
                    undefined
                ])
                .mockResolvedValueOnce([
                    [{ released: 1 }],
                    undefined
                ])
        };

        await acquireMigrationLock(
            connection as never,
            "product-service:migrations:test",
            30
        );
        await releaseMigrationLock(
            connection as never,
            "product-service:migrations:test"
        );

        expect(connection.execute).toHaveBeenNthCalledWith(
            1,
            "SELECT GET_LOCK(?, ?) AS lock_acquired",
            ["product-service:migrations:test", 30]
        );
        expect(connection.execute).toHaveBeenNthCalledWith(
            2,
            "SELECT RELEASE_LOCK(?)",
            ["product-service:migrations:test"]
        );
    });

    it("rejects an empty migration file", () => {
        const directory = fs.mkdtempSync(
            path.join(os.tmpdir(), "migration-utils-")
        );

        try {
            fs.writeFileSync(
                path.join(directory, "001_empty.sql"),
                " \n\t "
            );

            expect(() =>
                loadMigrationFiles(directory)
            ).toThrow("is empty");
        } finally {
            fs.rmSync(directory, {
                recursive: true,
                force: true
            });
        }
    });

    it("registers a successfully executed migration with its checksum", async () => {
        const connection = {
            beginTransaction: jest.fn(),
            query: jest.fn(),
            execute: jest.fn(),
            commit: jest.fn(),
            rollback: jest.fn()
        };
        const migration = {
            name: "004_add_index.sql",
            sql: "CREATE INDEX idx_example ON example (id)",
            checksum: "migration-checksum"
        };

        await executeMigration(
            connection as never,
            migration
        );

        expect(connection.query).toHaveBeenCalledWith(
            migration.sql
        );
        expect(connection.execute).toHaveBeenCalledWith(
            expect.stringContaining(
                "INSERT INTO schema_migrations"
            ),
            [migration.name, migration.checksum]
        );
        expect(connection.commit).toHaveBeenCalledTimes(1);
        expect(connection.rollback).not.toHaveBeenCalled();
    });
});
