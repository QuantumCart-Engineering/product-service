import {
    ResultSetHeader
} from "mysql2";

import pool from "../../../config/database";

import {
    createProductRepository,
    findProductByIdRepository,
    findProductBySkuRepository,
    findProductBySlugRepository,
    updateProductRepository,
    deleteProductRepository,
    getProductCategoriesRepository,
    getActiveProductsRepository,
    getActiveProductsByCursorRepository,
    getProductsByCategoryRepository,
    getProductsByCategoryAndCursorRepository,
    searchProductsRepository,
    searchProductsByCursorRepository,
    ProductRecord
} from "../../../repositories/product.repository";

jest.mock(
    "../../../config/database",
    () => ({
        __esModule: true,
        default: {
            getConnection: jest.fn(),
            execute: jest.fn(),
            query: jest.fn()
        }
    })
);

const mockedPool =
    pool as unknown as {
        getConnection: jest.Mock;
        execute: jest.Mock;
        query: jest.Mock;
    };

describe("Product Repository", () => {
    const productId =
        "550e8400-e29b-41d4-a716-446655440001";

    const categoryId =
        "550e8400-e29b-41d4-a716-446655440002";

    const secondCategoryId =
        "550e8400-e29b-41d4-a716-446655440003";

    const product: ProductRecord = {
        id: productId,
        name: "iPhone 17",
        slug: "iphone-17",
        description:
            "Latest Apple smartphone",
        price: 79999,
        sku: "IPH17-128-BLK",
        stock_quantity: 50,
        status: "ACTIVE",
        created_at:
            new Date("2026-01-01T10:00:00Z"),
        updated_at:
            new Date("2026-01-01T10:00:00Z")
    };

    const createConnectionMock = () => {
        const connection = {
            beginTransaction:
                jest.fn(),

            execute:
                jest.fn(),

            query:
                jest.fn(),

            commit:
                jest.fn(),

            rollback:
                jest.fn(),

            release:
                jest.fn()
        };

        mockedPool.getConnection.mockResolvedValue(
            connection
        );

        return connection;
    };

    beforeEach(() => {
        // Reset queued mock responses as well as call history. Several tests
        // intentionally provide a response for a query that is skipped by an
        // early return, and clearAllMocks would leak it into the next test.
        jest.resetAllMocks();
    });

    describe("createProductRepository", () => {
        it("should create product and category mappings in a transaction", async () => {
            const connection =
                createConnectionMock();

            connection.execute
                .mockResolvedValueOnce([
                    {
                        affectedRows: 1,
                        insertId: 1
                    } as ResultSetHeader
                ])
                .mockResolvedValueOnce([
                    [product]
                ])
                .mockResolvedValueOnce([
                    {
                        affectedRows: 1
                    } as ResultSetHeader
                ]);

            const result =
                await createProductRepository(
                    {
                        name: "iPhone 17",
                        description:
                            "Latest Apple smartphone",
                        price: 79999,
                        sku: "IPH17-128-BLK",
                        stockQuantity: 50,
                        categoryIds: [
                            categoryId
                        ]
                    },
                    "iphone-17"
                );

            expect(
                connection.beginTransaction
            ).toHaveBeenCalledTimes(1);

            expect(
                connection.execute
            ).toHaveBeenCalledTimes(3);

            expect(
                connection.commit
            ).toHaveBeenCalledTimes(1);

            expect(
                connection.rollback
            ).not.toHaveBeenCalled();

            expect(
                connection.release
            ).toHaveBeenCalledTimes(1);

            expect(result).toMatchObject({
                ...product,
                categoryIds: [
                    categoryId
                ]
            });
        });

        it("should create mappings for multiple categories", async () => {
            const connection =
                createConnectionMock();

            connection.execute
                .mockResolvedValueOnce([
                    {
                        affectedRows: 1
                    } as ResultSetHeader
                ])
                .mockResolvedValueOnce([
                    [product]
                ])
                .mockResolvedValueOnce([
                    {
                        affectedRows: 1
                    } as ResultSetHeader
                ])
                .mockResolvedValueOnce([
                    {
                        affectedRows: 1
                    } as ResultSetHeader
                ]);

            const categoryIds = [
                categoryId,
                secondCategoryId
            ];

            const result =
                await createProductRepository(
                    {
                        name: "iPhone 17",
                        price: 79999,
                        sku: "IPH17-128-BLK",
                        stockQuantity: 50,
                        categoryIds
                    },
                    "iphone-17"
                );

            expect(
                connection.execute
            ).toHaveBeenCalledTimes(4);

            expect(
                connection.commit
            ).toHaveBeenCalledTimes(1);

            expect(
                result.categoryIds
            ).toEqual(categoryIds);
        });

        it("should rollback when product creation fails", async () => {
            const connection =
                createConnectionMock();

            connection.execute.mockRejectedValue(
                new Error(
                    "Database insert failed"
                )
            );

            await expect(
                createProductRepository(
                    {
                        name: "iPhone 17",
                        price: 79999,
                        sku: "IPH17-128-BLK",
                        stockQuantity: 50,
                        categoryIds: [
                            categoryId
                        ]
                    },
                    "iphone-17"
                )
            ).rejects.toThrow(
                "Database insert failed"
            );

            expect(
                connection.rollback
            ).toHaveBeenCalledTimes(1);

            expect(
                connection.commit
            ).not.toHaveBeenCalled();

            expect(
                connection.release
            ).toHaveBeenCalledTimes(1);
        });

        it("should rollback when created product cannot be retrieved", async () => {
            const connection =
                createConnectionMock();

            connection.execute
                .mockResolvedValueOnce([
                    {
                        affectedRows: 1
                    } as ResultSetHeader
                ])
                .mockResolvedValueOnce([
                    []
                ]);

            await expect(
                createProductRepository(
                    {
                        name: "iPhone 17",
                        price: 79999,
                        sku: "IPH17-128-BLK",
                        stockQuantity: 50,
                        categoryIds: [
                            categoryId
                        ]
                    },
                    "iphone-17"
                )
            ).rejects.toThrow(
                "Product was created but could not be retrieved"
            );

            expect(
                connection.rollback
            ).toHaveBeenCalledTimes(1);

            expect(
                connection.commit
            ).not.toHaveBeenCalled();

            expect(
                connection.release
            ).toHaveBeenCalledTimes(1);
        });
    });

    describe("findProductByIdRepository", () => {
        it("should return product with categories", async () => {
            mockedPool.query
                .mockResolvedValueOnce([
                    [product]
                ])
                .mockResolvedValueOnce([
                    [
                        {
                            category_id:
                                categoryId
                        }
                    ]
                ]);

            const result =
                await findProductByIdRepository(
                    productId
                );

            expect(
                mockedPool.query
            ).toHaveBeenCalledTimes(2);

            expect(result).toMatchObject({
                ...product,
                categoryIds: [
                    categoryId
                ]
            });
        });

        it("should return null when product does not exist", async () => {
            mockedPool.query.mockResolvedValueOnce([
                []
            ]);

            const result =
                await findProductByIdRepository(
                    productId
                );

            expect(result).toBeNull();

            expect(
                mockedPool.query
            ).toHaveBeenCalledTimes(1);
        });
    });

    describe("findProductBySkuRepository", () => {
        it("should return product by SKU", async () => {
            mockedPool.query.mockResolvedValueOnce([
                [product]
            ]);

            const result =
                await findProductBySkuRepository(
                    product.sku
                );

            expect(
                mockedPool.query
            ).toHaveBeenCalledTimes(1);

            expect(result).toEqual(product);
        });

        it("should return null when SKU does not exist", async () => {
            mockedPool.query.mockResolvedValueOnce([
                []
            ]);

            const result =
                await findProductBySkuRepository(
                    "UNKNOWN-SKU"
                );

            expect(result).toBeNull();
        });
    });

    describe("findProductBySlugRepository", () => {
        it("should return product by slug", async () => {
            mockedPool.query.mockResolvedValueOnce([
                [product]
            ]);

            const result =
                await findProductBySlugRepository(
                    product.slug
                );

            expect(result).toEqual(product);
        });

        it("should return null when slug does not exist", async () => {
            mockedPool.query.mockResolvedValueOnce([
                []
            ]);

            const result =
                await findProductBySlugRepository(
                    "unknown-product"
                );

            expect(result).toBeNull();
        });
    });

    describe("updateProductRepository", () => {
        it("should update product successfully", async () => {
            const connection =
                createConnectionMock();

            const updatedProduct = {
                ...product,
                name: "iPhone 17 Pro"
            };

            connection.execute
                .mockResolvedValueOnce([
                    {
                        affectedRows: 1
                    } as ResultSetHeader
                ])
                .mockResolvedValueOnce([
                    [updatedProduct]
                ]);

            connection.query
                .mockResolvedValueOnce([
                    [
                        {
                            category_id:
                                categoryId
                        }
                    ]
                ]);

            const result =
                await updateProductRepository(
                    productId,
                    {
                        name: "iPhone 17 Pro"
                    },
                    product
                );

            expect(
                connection.beginTransaction
            ).toHaveBeenCalledTimes(1);

            expect(
                connection.execute
            ).toHaveBeenCalledTimes(2);

            expect(
                connection.query
            ).toHaveBeenCalledTimes(1);

            expect(
                connection.commit
            ).toHaveBeenCalledTimes(1);

            expect(result).toMatchObject({
                ...updatedProduct,
                categoryIds: [
                    categoryId
                ]
            });

            expect(
                connection.release
            ).toHaveBeenCalledTimes(1);
        });

        it("should replace category mappings when categoryIds are provided", async () => {
            const connection =
                createConnectionMock();

            const updatedProduct = {
                ...product
            };

            connection.execute
                .mockResolvedValueOnce([
                    {
                        affectedRows: 1
                    } as ResultSetHeader
                ])
                .mockResolvedValueOnce([
                    {
                        affectedRows: 1
                    } as ResultSetHeader
                ])
                .mockResolvedValueOnce([
                    {
                        affectedRows: 1
                    } as ResultSetHeader
                ])
                .mockResolvedValueOnce([
                    [updatedProduct]
                ]);

            connection.query
                .mockResolvedValueOnce([
                    [
                        {
                            category_id:
                                secondCategoryId
                        }
                    ]
                ]);

            const result =
                await updateProductRepository(
                    productId,
                    {
                        categoryIds: [
                            secondCategoryId
                        ]
                    },
                    product
                );

            expect(
                connection.execute
            ).toHaveBeenCalledTimes(4);

            expect(
                connection.query
            ).toHaveBeenCalledTimes(1);

            expect(
                connection.commit
            ).toHaveBeenCalledTimes(1);

            expect(
                result.categoryIds
            ).toEqual([
                secondCategoryId
            ]);
        });

        it("should rollback when update fails", async () => {
            const connection =
                createConnectionMock();

            connection.execute.mockRejectedValue(
                new Error(
                    "Update failed"
                )
            );

            await expect(
                updateProductRepository(
                    productId,
                    {
                        name: "Updated Product"
                    },
                    product
                )
            ).rejects.toThrow(
                "Update failed"
            );

            expect(
                connection.rollback
            ).toHaveBeenCalledTimes(1);

            expect(
                connection.commit
            ).not.toHaveBeenCalled();

            expect(
                connection.release
            ).toHaveBeenCalledTimes(1);
        });
    });

    describe("deleteProductRepository", () => {
        it("should soft delete product", async () => {
            mockedPool.execute.mockResolvedValueOnce([
                {
                    affectedRows: 1
                } as ResultSetHeader
            ]);

            await deleteProductRepository(
                productId
            );

            expect(
                mockedPool.execute
            ).toHaveBeenCalledTimes(1);
        });
    });

    describe("getProductCategoriesRepository", () => {
        it("should return category IDs", async () => {
            mockedPool.query.mockResolvedValueOnce([
                [
                    {
                        category_id:
                            categoryId
                    },
                    {
                        category_id:
                            secondCategoryId
                    }
                ]
            ]);

            const result =
                await getProductCategoriesRepository(
                    productId
                );

            expect(result).toEqual([
                categoryId,
                secondCategoryId
            ]);

            expect(
                mockedPool.query
            ).toHaveBeenCalledTimes(1);
        });

        it("should return empty array when no categories exist", async () => {
            mockedPool.query.mockResolvedValueOnce([
                []
            ]);

            const result =
                await getProductCategoriesRepository(
                    productId
                );

            expect(result).toEqual([]);
        });
    });

    describe("getActiveProductsRepository", () => {
        it("should return active products", async () => {
            mockedPool.query.mockResolvedValueOnce([
                [product]
            ]);

            const result =
                await getActiveProductsRepository(
                    20
                );

            expect(result).toEqual([
                product
            ]);

            expect(
                mockedPool.query
            ).toHaveBeenCalledTimes(1);
        });
    });

    describe("getActiveProductsByCursorRepository", () => {
        it("should return products after cursor", async () => {
            mockedPool.query.mockResolvedValueOnce([
                [product]
            ]);

            const cursor = {
                createdAt:
                    "2026-01-01T10:00:00.000Z",
                id: productId
            };

            const result =
                await getActiveProductsByCursorRepository(
                    cursor,
                    20
                );

            expect(result).toEqual([
                product
            ]);

            expect(
                mockedPool.query
            ).toHaveBeenCalledTimes(1);
        });
    });

    describe("getProductsByCategoryRepository", () => {
        it("should return active products for category", async () => {
            mockedPool.query.mockResolvedValueOnce([
                [product]
            ]);

            const result =
                await getProductsByCategoryRepository(
                    categoryId,
                    20
                );

            expect(result).toEqual([
                product
            ]);
        });
    });

    describe("getProductsByCategoryAndCursorRepository", () => {
        it("should return category products after cursor", async () => {
            mockedPool.query.mockResolvedValueOnce([
                [product]
            ]);

            const cursor = {
                createdAt:
                    "2026-01-01T10:00:00.000Z",
                id: productId
            };

            const result =
                await getProductsByCategoryAndCursorRepository(
                    categoryId,
                    cursor,
                    20
                );

            expect(result).toEqual([
                product
            ]);
        });
    });

    describe("searchProductsRepository", () => {
        it("should return products matching search", async () => {
            mockedPool.query.mockResolvedValueOnce([
                [product]
            ]);

            const result =
                await searchProductsRepository(
                    "iphone",
                    20
                );

            expect(result).toEqual([
                product
            ]);

            expect(
                mockedPool.query
            ).toHaveBeenCalledTimes(1);
        });
    });

    describe("searchProductsByCursorRepository", () => {
        it("should return search results after cursor", async () => {
            mockedPool.query.mockResolvedValueOnce([
                [product]
            ]);

            const cursor = {
                createdAt:
                    "2026-01-01T10:00:00.000Z",
                id: productId
            };

            const result =
                await searchProductsByCursorRepository(
                    "iphone",
                    cursor,
                    20
                );

            expect(result).toEqual([
                product
            ]);

            expect(
                mockedPool.query
            ).toHaveBeenCalledTimes(1);
        });
    });
});
