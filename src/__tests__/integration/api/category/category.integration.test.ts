import request from "supertest";
import { randomUUID } from "crypto";
import { RowDataPacket } from "mysql2";

import app from "../../../../app";
import pool from "../../../../config/database";

interface CategoryDatabaseRow
    extends RowDataPacket {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    parent_id: string | null;
    status: string;
}

interface CategoryStatusRow
    extends RowDataPacket {
    id: string;
    status: string;
}

describe("Category API - integration", () => {
    const testSuffix =
        randomUUID().slice(0, 8);

    const parentCategory = {
        name: `Electronics ${testSuffix}`,
        description:
            "Integration test parent category"
    };

    const childCategory = {
        name: `Mobiles ${testSuffix}`,
        description:
            "Integration test child category"
    };

    let parentCategoryId: string;
    let childCategoryId: string;

    afterAll(async () => {
        // Delete child first because it references
        // the parent category.
        if (childCategoryId) {
            await pool.execute(
                `
                DELETE FROM categories
                WHERE id = ?
                `,
                [childCategoryId]
            );
        }

        if (parentCategoryId) {
            await pool.execute(
                `
                DELETE FROM categories
                WHERE id = ?
                `,
                [parentCategoryId]
            );
        }

        // Safety cleanup.
        await pool.execute(
            `
            DELETE FROM categories
            WHERE name IN (?, ?)
            `,
            [
                parentCategory.name,
                childCategory.name
            ]
        );

        await pool.end();
    });

    describe("POST /api/v1/categories", () => {
        it("should create a parent category successfully", async () => {
            const response =
                await request(app)
                    .post(
                        "/api/v1/categories"
                    )
                    .send(parentCategory)
                    .expect(201);

            expect(response.body).toMatchObject({
                success: true,
                message:
                    "Category created successfully"
            });

            expect(
                response.body.data
            ).toMatchObject({
                name: parentCategory.name,
                slug: expect.any(String),
                description:
                    parentCategory.description,
                parentId: null
            });

            expect(
                response.body.data.id
            ).toEqual(
                expect.any(String)
            );

            parentCategoryId =
                response.body.data.id;

            // Verify actual database record.
            const [rows] =
                await pool.execute<
                    CategoryDatabaseRow[]
                >(
                    `
                    SELECT
                        id,
                        name,
                        slug,
                        description,
                        parent_id,
                        status
                    FROM categories
                    WHERE id = ?
                    `,
                    [parentCategoryId]
                );

            expect(rows).toHaveLength(1);

            expect(rows[0]).toMatchObject({
                id: parentCategoryId,
                name: parentCategory.name,
                description:
                    parentCategory.description,
                parent_id: null,
                status: "ACTIVE"
            });
        });

        it("should create a child category successfully", async () => {
            const response =
                await request(app)
                    .post(
                        "/api/v1/categories"
                    )
                    .send({
                        ...childCategory,
                        parentId:
                            parentCategoryId
                    })
                    .expect(201);

            expect(response.body).toMatchObject({
                success: true,
                message:
                    "Category created successfully"
            });

            expect(
                response.body.data
            ).toMatchObject({
                name: childCategory.name,
                slug: expect.any(String),
                description:
                    childCategory.description,
                parentId:
                    parentCategoryId
            });

            childCategoryId =
                response.body.data.id;

            // Verify actual database relationship.
            const [rows] =
                await pool.execute<
                    CategoryStatusRow[]
                >(
                    `
                    SELECT
                        id,
                        parent_id,
                        status
                    FROM categories
                    WHERE id = ?
                    `,
                    [childCategoryId]
                );

            expect(rows).toHaveLength(1);

            expect(rows[0]).toMatchObject({
                id: childCategoryId,
                parent_id:
                    parentCategoryId,
                status: "ACTIVE"
            });
        });

        it("should reject duplicate category name", async () => {
            const response =
                await request(app)
                    .post(
                        "/api/v1/categories"
                    )
                    .send({
                        name:
                            parentCategory.name
                    })
                    .expect(409);

            expect(response.body).toMatchObject({
                success: false,
                message:
                    "Category name is already registered"
            });
        });

        it("should reject non-existing parent category", async () => {
            const response =
                await request(app)
                    .post(
                        "/api/v1/categories"
                    )
                    .send({
                        name:
                            `Invalid Child ${testSuffix}`,
                        parentId:
                            randomUUID()
                    })
                    .expect(404);

            expect(response.body).toMatchObject({
                success: false,
                message:
                    "Parent category not found"
            });
        });

        it("should reject invalid category data", async () => {
            const response =
                await request(app)
                    .post(
                        "/api/v1/categories"
                    )
                    .send({
                        name: ""
                    })
                    .expect(400);

            expect(response.body).toMatchObject({
                success: false
            });

            expect(
                response.body.message
            ).toContain(
                "Category name is required"
            );
        });
    });

    describe("GET /api/v1/categories", () => {
        it("should return active categories", async () => {
            const response =
                await request(app)
                    .get(
                        "/api/v1/categories"
                    )
                    .expect(200);

            expect(response.body).toMatchObject({
                success: true,
                message:
                    "Categories fetched successfully"
            });

            expect(
                Array.isArray(
                    response.body.data
                )
            ).toBe(true);

            const parent =
                response.body.data.find(
                    (category: {
                        id: string;
                    }) =>
                        category.id ===
                        parentCategoryId
                );

            const child =
                response.body.data.find(
                    (category: {
                        id: string;
                    }) =>
                        category.id ===
                        childCategoryId
                );

            expect(parent).toBeDefined();
            expect(child).toBeDefined();

            expect(
                child.parentId
            ).toBe(parentCategoryId);
        });
    });

    describe("GET /api/v1/categories/:id", () => {
        it("should return category by id", async () => {
            const response =
                await request(app)
                    .get(
                        `/api/v1/categories/${parentCategoryId}`
                    )
                    .expect(200);

            expect(response.body).toMatchObject({
                success: true,
                message:
                    "Category fetched successfully"
            });

            expect(
                response.body.data
            ).toMatchObject({
                id: parentCategoryId,
                name: parentCategory.name,
                description:
                    parentCategory.description,
                parentId: null,
                status: "ACTIVE"
            });
        });

        it("should return 404 for non-existing category", async () => {
            const response =
                await request(app)
                    .get(
                        `/api/v1/categories/${randomUUID()}`
                    )
                    .expect(404);

            expect(response.body).toMatchObject({
                success: false,
                message:
                    "Category not found"
            });
        });
    });

    describe("PUT /api/v1/categories/:id", () => {
        it("should update category successfully", async () => {
            const updatedName =
                `Smartphones ${testSuffix}`;

            const updatedDescription =
                "Updated integration test category";

            const response =
                await request(app)
                    .put(
                        `/api/v1/categories/${childCategoryId}`
                    )
                    .send({
                        name: updatedName,
                        description:
                            updatedDescription
                    })
                    .expect(200);

            expect(response.body).toMatchObject({
                success: true,
                message:
                    "Category updated successfully"
            });

            expect(
                response.body.data
            ).toMatchObject({
                id: childCategoryId,
                name: updatedName,
                slug: expect.any(String),
                description:
                    updatedDescription,
                parentId:
                    parentCategoryId
            });

            childCategory.name =
                updatedName;

            // Verify actual database update.
            const [rows] =
                await pool.execute<
                    CategoryDatabaseRow[]
                >(
                    `
                    SELECT
                        id,
                        name,
                        slug,
                        description,
                        parent_id,
                        status
                    FROM categories
                    WHERE id = ?
                    `,
                    [childCategoryId]
                );

            expect(rows).toHaveLength(1);

            expect(rows[0]).toMatchObject({
                id: childCategoryId,
                name: updatedName,
                description:
                    updatedDescription,
                parent_id:
                    parentCategoryId,
                status: "ACTIVE"
            });
        });

        it("should reject category becoming its own parent", async () => {
            const response =
                await request(app)
                    .put(
                        `/api/v1/categories/${childCategoryId}`
                    )
                    .send({
                        name:
                            childCategory.name,
                        parentId:
                            childCategoryId
                    })
                    .expect(400);

            expect(response.body).toMatchObject({
                success: false,
                message:
                    "Category cannot be its own parent"
            });
        });

        it("should reject duplicate category name", async () => {
            const response =
                await request(app)
                    .put(
                        `/api/v1/categories/${childCategoryId}`
                    )
                    .send({
                        name:
                            parentCategory.name
                    })
                    .expect(409);

            expect(response.body).toMatchObject({
                success: false,
                message:
                    "Category name is already registered"
            });
        });
    });

    describe("DELETE /api/v1/categories/:id", () => {
        it("should soft delete the child category", async () => {
            const response =
                await request(app)
                    .delete(
                        `/api/v1/categories/${childCategoryId}`
                    )
                    .expect(200);

            expect(response.body).toMatchObject({
                success: true,
                message:
                    "Category deleted successfully"
            });

            // Verify that the row still exists
            // but status is INACTIVE.
            const [rows] =
                await pool.execute<
                    CategoryStatusRow[]
                >(
                    `
                    SELECT
                        id,
                        status
                    FROM categories
                    WHERE id = ?
                    `,
                    [childCategoryId]
                );

            expect(rows).toHaveLength(1);

            expect(rows[0]).toMatchObject({
                id: childCategoryId,
                status: "INACTIVE"
            });
        });

        it("should reject deleting an already inactive category", async () => {
            const response =
                await request(app)
                    .delete(
                        `/api/v1/categories/${childCategoryId}`
                    )
                    .expect(400);

            expect(response.body).toMatchObject({
                success: false,
                message:
                    "Category is already inactive"
            });
        });
    });
});