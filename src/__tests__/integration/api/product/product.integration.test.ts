import request from "supertest";

import app from "../../../../app";

import pool from "../../../../config/database";

describe("Product API - integration", () => {
    let categoryId: string;
    let secondCategoryId: string;
    let productId: string;

    const uniqueSuffix =
        Date.now().toString();

    const createCategory = async (
        name: string,
        slug: string
    ) => {
        const response =
            await request(app)
                .post(
                    "/api/v1/categories"
                )
                .send({
                    name,
                    slug,
                    description:
                        "Integration test category"
                });

        expect(
            response.status
        ).toBe(201);

        return response.body.data.id;
    };

    beforeAll(async () => {
        categoryId =
            await createCategory(
                `Integration Electronics ${uniqueSuffix}`,
                `integration-electronics-${uniqueSuffix}`
            );

        secondCategoryId =
            await createCategory(
                `Integration Mobile ${uniqueSuffix}`,
                `integration-mobile-${uniqueSuffix}`
            );
    });

    afterAll(async () => {
        /*
         * Close database pool after
         * integration tests complete.
         */
        await pool.end();
    });

    describe("POST /api/v1/products", () => {
        it("should create a product successfully", async () => {
            const response =
                await request(app)
                    .post(
                        "/api/v1/products"
                    )
                    .send({
                        name: `Integration iPhone ${uniqueSuffix}`,
                        description:
                            "Integration test product",
                        price: 79999,
                        sku: `INT-SKU-${uniqueSuffix}`,
                        stockQuantity: 50,
                        categoryIds: [
                            categoryId
                        ]
                    });

            expect(
                response.status
            ).toBe(201);

            expect(
                response.body.success
            ).toBe(true);

            expect(
                response.body.data
            ).toBeDefined();

            expect(
                response.body.data.name
            ).toBe(
                `Integration iPhone ${uniqueSuffix}`
            );

            expect(
                response.body.data.sku
            ).toBe(
                `INT-SKU-${uniqueSuffix}`
            );

            productId =
                response.body.data.id;
        });

        it("should create a product with multiple categories", async () => {
            const response =
                await request(app)
                    .post(
                        "/api/v1/products"
                    )
                    .send({
                        name: `Multi Category Product ${uniqueSuffix}`,
                        description:
                            "Multiple category product",
                        price: 49999,
                        sku: `MULTI-SKU-${uniqueSuffix}`,
                        stockQuantity: 20,
                        categoryIds: [
                            categoryId,
                            secondCategoryId
                        ]
                    });

            expect(
                response.status
            ).toBe(201);

            expect(
                response.body.success
            ).toBe(true);

            expect(
                response.body.data
            ).toBeDefined();
        });

        it("should reject duplicate SKU", async () => {
            const response =
                await request(app)
                    .post(
                        "/api/v1/products"
                    )
                    .send({
                        name: `Another Product ${uniqueSuffix}`,
                        description:
                            "Duplicate SKU test",
                        price: 29999,
                        sku: `INT-SKU-${uniqueSuffix}`,
                        stockQuantity: 10,
                        categoryIds: [
                            categoryId
                        ]
                    });

            expect(
                response.status
            ).toBe(409);

            expect(
                response.body.success
            ).toBe(false);
        });

        it("should reject duplicate product name", async () => {
            const response =
                await request(app)
                    .post(
                        "/api/v1/products"
                    )
                    .send({
                        name: `Integration iPhone ${uniqueSuffix}`,
                        description:
                            "Duplicate name test",
                        price: 89999,
                        sku: `DUP-NAME-SKU-${uniqueSuffix}`,
                        stockQuantity: 10,
                        categoryIds: [
                            categoryId
                        ]
                    });

            expect(
                response.status
            ).toBe(409);

            expect(
                response.body.success
            ).toBe(false);
        });

        it("should reject non-existing category", async () => {
            const response =
                await request(app)
                    .post(
                        "/api/v1/products"
                    )
                    .send({
                        name: `Invalid Category Product ${uniqueSuffix}`,
                        description:
                            "Invalid category test",
                        price: 19999,
                        sku: `INVALID-CAT-${uniqueSuffix}`,
                        stockQuantity: 10,
                        categoryIds: [
                            "550e8400-e29b-41d4-a716-446655440999"
                        ]
                    });

            expect(
                response.status
            ).toBe(404);

            expect(
                response.body.success
            ).toBe(false);
        });

        it("should reject invalid product data", async () => {
            const response =
                await request(app)
                    .post(
                        "/api/v1/products"
                    )
                    .send({
                        name: "",
                        price: -100,
                        sku: "",
                        stockQuantity: -1,
                        categoryIds: []
                    });

            expect(
                response.status
            ).toBe(400);

            expect(
                response.body.success
            ).toBe(false);
        });
    });

    describe("GET /api/v1/products", () => {
        it("should return active products", async () => {
            const response =
                await request(app)
                    .get(
                        "/api/v1/products"
                    );

            expect(
                response.status
            ).toBe(200);

            expect(
                response.body.success
            ).toBe(true);

            expect(
                Array.isArray(
                    response.body.data
                )
            ).toBe(true);

            expect(
                response.body.pagination
            ).toBeDefined();

            expect(
                response.body.pagination.limit
            ).toBe(20);
        });

        it("should respect limit query parameter", async () => {
            const response =
                await request(app)
                    .get(
                        "/api/v1/products"
                    )
                    .query({
                        limit: 1
                    });

            expect(
                response.status
            ).toBe(200);

            expect(
                response.body.pagination.limit
            ).toBe(1);

            expect(
                response.body.data.length
            ).toBeLessThanOrEqual(1);
        });

        it("should filter products by category", async () => {
            const response =
                await request(app)
                    .get(
                        "/api/v1/products"
                    )
                    .query({
                        categoryId
                    });

            expect(
                response.status
            ).toBe(200);

            expect(
                response.body.success
            ).toBe(true);

            expect(
                Array.isArray(
                    response.body.data
                )
            ).toBe(true);
        });

        it("should search products", async () => {
            const response =
                await request(app)
                    .get(
                        "/api/v1/products"
                    )
                    .query({
                        search:
                            `Integration iPhone ${uniqueSuffix}`
                    });

            expect(
                response.status
            ).toBe(200);

            expect(
                response.body.success
            ).toBe(true);

            expect(
                Array.isArray(
                    response.body.data
                )
            ).toBe(true);
        });

        it("should reject invalid limit", async () => {
            const response =
                await request(app)
                    .get(
                        "/api/v1/products"
                    )
                    .query({
                        limit: 101
                    });

            expect(
                response.status
            ).toBe(400);

            expect(
                response.body.success
            ).toBe(false);
        });

        it("should reject invalid category ID", async () => {
            const response =
                await request(app)
                    .get(
                        "/api/v1/products"
                    )
                    .query({
                        categoryId:
                            "invalid-category"
                    });

            expect(
                response.status
            ).toBe(400);

            expect(
                response.body.success
            ).toBe(false);
        });

        it("should paginate products using cursor", async () => {
            const firstResponse =
                await request(app)
                    .get(
                        "/api/v1/products"
                    )
                    .query({
                        limit: 1
                    });

            expect(
                firstResponse.status
            ).toBe(200);

            expect(
                firstResponse.body.success
            ).toBe(true);

            expect(
                firstResponse.body.pagination
                    .nextCursor
            ).toBeTruthy();

            const nextCursor =
                firstResponse.body.pagination
                    .nextCursor;

            const secondResponse =
                await request(app)
                    .get(
                        "/api/v1/products"
                    )
                    .query({
                        limit: 1,
                        cursor: nextCursor
                    });

            expect(
                secondResponse.status
            ).toBe(200);

            expect(
                secondResponse.body.success
            ).toBe(true);

            expect(
                Array.isArray(
                    secondResponse.body.data
                )
            ).toBe(true);

            /*
             * When another page exists, the first
             * and second page should not return
             * the same product.
             */
            if (
                firstResponse.body.data.length > 0 &&
                secondResponse.body.data.length > 0
            ) {
                expect(
                    secondResponse.body.data[0].id
                ).not.toBe(
                    firstResponse.body.data[0].id
                );
            }
        });

        it("should reject an invalid cursor", async () => {
            const response =
                await request(app)
                    .get(
                        "/api/v1/products"
                    )
                    .query({
                        limit: 1,
                        cursor: "invalid-cursor"
                    });

            expect(
                response.status
            ).toBe(400);

            expect(
                response.body.success
            ).toBe(false);

            expect(
                response.body.message
            ).toBe(
                "Invalid cursor"
            );
        });
    });

    describe("GET /api/v1/products/:id", () => {
        it("should return product by id", async () => {
            const response =
                await request(app)
                    .get(
                        `/api/v1/products/${productId}`
                    );

            expect(
                response.status
            ).toBe(200);

            expect(
                response.body.success
            ).toBe(true);

            expect(
                response.body.data.id
            ).toBe(productId);
        });

        it("should return 404 for non-existing product", async () => {
            const response =
                await request(app)
                    .get(
                        "/api/v1/products/550e8400-e29b-41d4-a716-446655440999"
                    );

            expect(
                response.status
            ).toBe(404);

            expect(
                response.body.success
            ).toBe(false);
        });
    });

    describe("PUT /api/v1/products/:id", () => {
        it("should update product successfully", async () => {
            const response =
                await request(app)
                    .put(
                        `/api/v1/products/${productId}`
                    )
                    .send({
                        name: `Updated iPhone ${uniqueSuffix}`,
                        price: 84999
                    });

            expect(
                response.status
            ).toBe(200);

            expect(
                response.body.success
            ).toBe(true);

            expect(
                response.body.data.name
            ).toBe(
                `Updated iPhone ${uniqueSuffix}`
            );

            expect(
                response.body.data.price
            ).toBe(84999);
        });

        it("should reject empty update", async () => {
            const response =
                await request(app)
                    .put(
                        `/api/v1/products/${productId}`
                    )
                    .send({});

            expect(
                response.status
            ).toBe(400);

            expect(
                response.body.success
            ).toBe(false);
        });

        it("should reject duplicate SKU during update", async () => {
            const response =
                await request(app)
                    .put(
                        `/api/v1/products/${productId}`
                    )
                    .send({
                        sku: `MULTI-SKU-${uniqueSuffix}`
                    });

            expect(
                response.status
            ).toBe(409);

            expect(
                response.body.success
            ).toBe(false);
        });

        it("should reject non-existing product during update", async () => {
            const response =
                await request(app)
                    .put(
                        "/api/v1/products/550e8400-e29b-41d4-a716-446655440999"
                    )
                    .send({
                        name: "Updated Product"
                    });

            expect(
                response.status
            ).toBe(404);

            expect(
                response.body.success
            ).toBe(false);
        });
    });

    describe("DELETE /api/v1/products/:id", () => {
        it("should soft delete the product", async () => {
            const response =
                await request(app)
                    .delete(
                        `/api/v1/products/${productId}`
                    );

            expect(
                response.status
            ).toBe(200);

            expect(
                response.body.success
            ).toBe(true);

            expect(
                response.body.message
            ).toBe(
                "Product deleted successfully"
            );
        });

        it("should reject deleting an already inactive product", async () => {
            const response =
                await request(app)
                    .delete(
                        `/api/v1/products/${productId}`
                    );

            expect(
                response.status
            ).toBe(400);

            expect(
                response.body.success
            ).toBe(false);
        });

        it("should return 404 for non-existing product", async () => {
            const response =
                await request(app)
                    .delete(
                        "/api/v1/products/550e8400-e29b-41d4-a716-446655440999"
                    );

            expect(
                response.status
            ).toBe(404);

            expect(
                response.body.success
            ).toBe(false);
        });
    });
});