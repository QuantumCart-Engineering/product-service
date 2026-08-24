import {
    createProductService,
    getProductByIdService,
    getProductsService,
    updateProductService,
    deleteProductService
} from "../../../services/product.service";

import {
    createProductRepository,
    deleteProductRepository,
    findProductByIdRepository,
    findProductBySkuRepository,
    findProductBySlugRepository,
    getActiveProductsRepository,
    getActiveProductsByCursorRepository,
    getProductsByCategoryRepository,
    getProductsByCategoryAndCursorRepository,
    searchProductsRepository,
    searchProductsByCursorRepository,
    updateProductRepository
} from "../../../repositories/product.repository";

import {
    findCategoryById
} from "../../../repositories/category.repository";

jest.mock(
    "../../../repositories/product.repository",
    () => ({
        createProductRepository:
            jest.fn(),
        deleteProductRepository:
            jest.fn(),
        findProductByIdRepository:
            jest.fn(),
        findProductBySkuRepository:
            jest.fn(),
        findProductBySlugRepository:
            jest.fn(),
        getActiveProductsRepository:
            jest.fn(),
        getActiveProductsByCursorRepository:
            jest.fn(),
        getProductsByCategoryRepository:
            jest.fn(),
        getProductsByCategoryAndCursorRepository:
            jest.fn(),
        searchProductsRepository:
            jest.fn(),
        searchProductsByCursorRepository:
            jest.fn(),
        updateProductRepository:
            jest.fn()
    })
);

jest.mock(
    "../../../repositories/category.repository",
    () => ({
        findCategoryById:
            jest.fn()
    })
);

const mockedCreateProductRepository =
    createProductRepository as jest.Mock;

const mockedDeleteProductRepository =
    deleteProductRepository as jest.Mock;

const mockedFindProductByIdRepository =
    findProductByIdRepository as jest.Mock;

const mockedFindProductBySkuRepository =
    findProductBySkuRepository as jest.Mock;

const mockedFindProductBySlugRepository =
    findProductBySlugRepository as jest.Mock;

const mockedGetActiveProductsRepository =
    getActiveProductsRepository as jest.Mock;

const mockedGetActiveProductsByCursorRepository =
    getActiveProductsByCursorRepository as jest.Mock;

const mockedGetProductsByCategoryRepository =
    getProductsByCategoryRepository as jest.Mock;

const mockedGetProductsByCategoryAndCursorRepository =
    getProductsByCategoryAndCursorRepository as jest.Mock;

const mockedSearchProductsRepository =
    searchProductsRepository as jest.Mock;

const mockedSearchProductsByCursorRepository =
    searchProductsByCursorRepository as jest.Mock;

const mockedUpdateProductRepository =
    updateProductRepository as jest.Mock;

const mockedFindCategoryById =
    findCategoryById as jest.Mock;

describe("Product Service", () => {
    const productId =
        "550e8400-e29b-41d4-a716-446655440001";

    const categoryId =
        "550e8400-e29b-41d4-a716-446655440002";

    const secondCategoryId =
        "550e8400-e29b-41d4-a716-446655440003";

    const product = {
        id: productId,
        name: "iPhone 17",
        slug: "iphone-17",
        description:
            "Latest Apple smartphone",
        price: 79999,
        sku: "IPH17-128-BLK",
        stock_quantity: 50,
        status: "ACTIVE" as const,
        created_at:
            new Date("2026-01-01T10:00:00Z"),
        updated_at:
            new Date("2026-01-01T10:00:00Z"),
        categoryIds: [
            categoryId
        ]
    };

    const activeCategory = {
        id: categoryId,
        name: "Electronics",
        slug: "electronics",
        description:
            "Electronic products",
        parent_id: null,
        status: "ACTIVE" as const,
        created_at:
            new Date("2026-01-01T10:00:00Z"),
        updated_at:
            new Date("2026-01-01T10:00:00Z")
    };

    const inactiveCategory = {
        ...activeCategory,
        status: "INACTIVE" as const
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("createProductService", () => {
        const validData = {
            name: "iPhone 17",
            description:
                "Latest Apple smartphone",
            price: 79999,
            sku: "IPH17-128-BLK",
            stockQuantity: 50,
            categoryIds: [
                categoryId
            ]
        };

        it("should create a product successfully", async () => {
            mockedFindProductBySkuRepository
                .mockResolvedValue(null);

            mockedFindProductBySlugRepository
                .mockResolvedValue(null);

            mockedFindCategoryById
                .mockResolvedValue([
                    activeCategory
                ]);

            mockedCreateProductRepository
                .mockResolvedValue(product);

            const result =
                await createProductService(
                    validData
                );

            expect(
                mockedFindProductBySkuRepository
            ).toHaveBeenCalledWith(
                "IPH17-128-BLK"
            );

            expect(
                mockedFindProductBySlugRepository
            ).toHaveBeenCalledWith(
                "iphone-17"
            );

            expect(
                mockedFindCategoryById
            ).toHaveBeenCalledWith(
                categoryId
            );

            expect(
                mockedCreateProductRepository
            ).toHaveBeenCalledWith(
                validData,
                "iphone-17"
            );

            expect(result).toEqual(
                product
            );
        });

        it("should reject duplicate SKU", async () => {
            mockedFindProductBySkuRepository
                .mockResolvedValue(product);

            await expect(
                createProductService(
                    validData
                )
            ).rejects.toThrow(
                "Product with this SKU already exists"
            );

            expect(
                mockedFindProductBySlugRepository
            ).not.toHaveBeenCalled();

            expect(
                mockedCreateProductRepository
            ).not.toHaveBeenCalled();
        });

        it("should reject duplicate product name", async () => {
            mockedFindProductBySkuRepository
                .mockResolvedValue(null);

            mockedFindProductBySlugRepository
                .mockResolvedValue(product);

            await expect(
                createProductService(
                    validData
                )
            ).rejects.toThrow(
                "Product with this name already exists"
            );

            expect(
                mockedFindCategoryById
            ).not.toHaveBeenCalled();

            expect(
                mockedCreateProductRepository
            ).not.toHaveBeenCalled();
        });

        it("should reject when category does not exist", async () => {
            mockedFindProductBySkuRepository
                .mockResolvedValue(null);

            mockedFindProductBySlugRepository
                .mockResolvedValue(null);

            mockedFindCategoryById
                .mockResolvedValue([]);

            await expect(
                createProductService(
                    validData
                )
            ).rejects.toThrow(
                `Category ${categoryId} does not exist`
            );

            expect(
                mockedCreateProductRepository
            ).not.toHaveBeenCalled();
        });

        it("should reject when category is inactive", async () => {
            mockedFindProductBySkuRepository
                .mockResolvedValue(null);

            mockedFindProductBySlugRepository
                .mockResolvedValue(null);

            mockedFindCategoryById
                .mockResolvedValue([
                    inactiveCategory
                ]);

            await expect(
                createProductService(
                    validData
                )
            ).rejects.toThrow(
                `Category ${categoryId} is inactive`
            );

            expect(
                mockedCreateProductRepository
            ).not.toHaveBeenCalled();
        });

        it("should validate all categories before creating product", async () => {
            const data = {
                ...validData,
                categoryIds: [
                    categoryId,
                    secondCategoryId
                ]
            };

            mockedFindProductBySkuRepository
                .mockResolvedValue(null);

            mockedFindProductBySlugRepository
                .mockResolvedValue(null);

            mockedFindCategoryById
                .mockResolvedValueOnce([
                    activeCategory
                ])
                .mockResolvedValueOnce([
                    {
                        ...activeCategory,
                        id: secondCategoryId
                    }
                ]);

            mockedCreateProductRepository
                .mockResolvedValue({
                    ...product,
                    categoryIds: [
                        categoryId,
                        secondCategoryId
                    ]
                });

            await createProductService(
                data
            );

            expect(
                mockedFindCategoryById
            ).toHaveBeenCalledTimes(2);

            expect(
                mockedFindCategoryById
            ).toHaveBeenNthCalledWith(
                1,
                categoryId
            );

            expect(
                mockedFindCategoryById
            ).toHaveBeenNthCalledWith(
                2,
                secondCategoryId
            );

            expect(
                mockedCreateProductRepository
            ).toHaveBeenCalledTimes(1);
        });
    });

    describe("getProductByIdService", () => {
        it("should return product successfully", async () => {
            mockedFindProductByIdRepository
                .mockResolvedValue(product);

            const result =
                await getProductByIdService(
                    productId
                );

            expect(
                mockedFindProductByIdRepository
            ).toHaveBeenCalledWith(
                productId
            );

            expect(result).toEqual(
                product
            );
        });

        it("should reject when product does not exist", async () => {
            mockedFindProductByIdRepository
                .mockResolvedValue(null);

            await expect(
                getProductByIdService(
                    productId
                )
            ).rejects.toThrow(
                "Product not found"
            );
        });
    });

    describe("getProductsService", () => {
        it("should return active products", async () => {
            const products = [
                product
            ];

            mockedGetActiveProductsRepository
                .mockResolvedValue(
                    products
                );

            const result =
                await getProductsService({
                    limit: 20
                });

            expect(
                mockedGetActiveProductsRepository
            ).toHaveBeenCalledWith(
                20
            );

            expect(result).toEqual({
                products,
                hasMore: false
            });
        });

        it("should set hasMore when result count equals limit", async () => {
            const products = Array.from(
                { length: 20 },
                (_, index) => ({
                    ...product,
                    id: `product-${index}`
                })
            );

            mockedGetActiveProductsRepository
                .mockResolvedValue(
                    products
                );

            const result =
                await getProductsService({
                    limit: 20
                });

            expect(
                result.hasMore
            ).toBe(true);
        });

        it("should return cursor-based products", async () => {
            const cursor = {
                createdAt:
                    "2026-01-01T10:00:00.000Z",
                id: productId
            };

            mockedGetActiveProductsByCursorRepository
                .mockResolvedValue([
                    product
                ]);

            const result =
                await getProductsService({
                    limit: 20,
                    cursor
                });

            expect(
                mockedGetActiveProductsByCursorRepository
            ).toHaveBeenCalledWith(
                cursor,
                20
            );

            expect(result).toEqual({
                products: [
                    product
                ],
                hasMore: false
            });
        });

        it("should return products by category", async () => {
            mockedFindCategoryById
                .mockResolvedValue([
                    activeCategory
                ]);

            mockedGetProductsByCategoryRepository
                .mockResolvedValue([
                    product
                ]);

            const result =
                await getProductsService({
                    limit: 20,
                    categoryId
                });

            expect(
                mockedFindCategoryById
            ).toHaveBeenCalledWith(
                categoryId
            );

            expect(
                mockedGetProductsByCategoryRepository
            ).toHaveBeenCalledWith(
                categoryId,
                20
            );

            expect(result).toEqual({
                products: [
                    product
                ],
                hasMore: false
            });
        });

        it("should return category products using cursor", async () => {
            const cursor = {
                createdAt:
                    "2026-01-01T10:00:00.000Z",
                id: productId
            };

            mockedFindCategoryById
                .mockResolvedValue([
                    activeCategory
                ]);

            mockedGetProductsByCategoryAndCursorRepository
                .mockResolvedValue([
                    product
                ]);

            const result =
                await getProductsService({
                    limit: 20,
                    categoryId,
                    cursor
                });

            expect(
                mockedGetProductsByCategoryAndCursorRepository
            ).toHaveBeenCalledWith(
                categoryId,
                cursor,
                20
            );

            expect(result).toEqual({
                products: [
                    product
                ],
                hasMore: false
            });
        });

        it("should search products", async () => {
            mockedSearchProductsRepository
                .mockResolvedValue([
                    product
                ]);

            const result =
                await getProductsService({
                    limit: 20,
                    search: "iphone"
                });

            expect(
                mockedSearchProductsRepository
            ).toHaveBeenCalledWith(
                "iphone",
                20
            );

            expect(result).toEqual({
                products: [
                    product
                ],
                hasMore: false
            });
        });

        it("should search products using cursor", async () => {
            const cursor = {
                createdAt:
                    "2026-01-01T10:00:00.000Z",
                id: productId
            };

            mockedSearchProductsByCursorRepository
                .mockResolvedValue([
                    product
                ]);

            const result =
                await getProductsService({
                    limit: 20,
                    search: "iphone",
                    cursor
                });

            expect(
                mockedSearchProductsByCursorRepository
            ).toHaveBeenCalledWith(
                "iphone",
                cursor,
                20
            );

            expect(result).toEqual({
                products: [
                    product
                ],
                hasMore: false
            });
        });

        it("should reject when category does not exist", async () => {
            mockedFindCategoryById
                .mockResolvedValue([]);

            await expect(
                getProductsService({
                    limit: 20,
                    categoryId
                })
            ).rejects.toThrow(
                "Category not found"
            );

            expect(
                mockedGetProductsByCategoryRepository
            ).not.toHaveBeenCalled();
        });

        it("should reject when category is inactive", async () => {
            mockedFindCategoryById
                .mockResolvedValue([
                    inactiveCategory
                ]);

            await expect(
                getProductsService({
                    limit: 20,
                    categoryId
                })
            ).rejects.toThrow(
                "Category is inactive"
            );

            expect(
                mockedGetProductsByCategoryRepository
            ).not.toHaveBeenCalled();
        });
    });

    describe("updateProductService", () => {
        it("should update product successfully", async () => {
            mockedFindProductByIdRepository
                .mockResolvedValue(product);

            mockedFindProductBySkuRepository
                .mockResolvedValue(null);

            mockedFindProductBySlugRepository
                .mockResolvedValue(null);

            const updatedProduct = {
                ...product,
                name: "iPhone 17 Pro",
                slug: "iphone-17-pro"
            };

            mockedUpdateProductRepository
                .mockResolvedValue(
                    updatedProduct
                );

            const result =
                await updateProductService(
                    productId,
                    {
                        name: "iPhone 17 Pro"
                    }
                );

            expect(
                mockedFindProductByIdRepository
            ).toHaveBeenCalledWith(
                productId
            );

            expect(
                mockedFindProductBySlugRepository
            ).toHaveBeenCalledWith(
                "iphone-17-pro"
            );

            expect(
                mockedUpdateProductRepository
            ).toHaveBeenCalledWith(
                productId,
                {
                    name: "iPhone 17 Pro",
                    slug: "iphone-17-pro"
                },
                expect.objectContaining({
                    id: productId,
                    name: "iPhone 17"
                })
            );

            expect(result).toEqual(
                updatedProduct
            );
        });

        it("should reject when product does not exist", async () => {
            mockedFindProductByIdRepository
                .mockResolvedValue(null);

            await expect(
                updateProductService(
                    productId,
                    {
                        name: "Updated Product"
                    }
                )
            ).rejects.toThrow(
                "Product not found"
            );

            expect(
                mockedUpdateProductRepository
            ).not.toHaveBeenCalled();
        });

        it("should reject when product is inactive", async () => {
            mockedFindProductByIdRepository
                .mockResolvedValue({
                    ...product,
                    status: "INACTIVE"
                });

            await expect(
                updateProductService(
                    productId,
                    {
                        name: "Updated Product"
                    }
                )
            ).rejects.toThrow(
                "Product is inactive"
            );
        });

        it("should reject duplicate SKU during update", async () => {
            mockedFindProductByIdRepository
                .mockResolvedValue(product);

            mockedFindProductBySkuRepository
                .mockResolvedValue({
                    ...product,
                    id: "another-product-id"
                });

            await expect(
                updateProductService(
                    productId,
                    {
                        sku: "ANOTHER-SKU"
                    }
                )
            ).rejects.toThrow(
                "Product with this SKU already exists"
            );

            expect(
                mockedUpdateProductRepository
            ).not.toHaveBeenCalled();
        });

        it("should allow the same SKU for the same product", async () => {
            mockedFindProductByIdRepository
                .mockResolvedValue(product);

            mockedFindProductBySkuRepository
                .mockResolvedValue(product);

            mockedUpdateProductRepository
                .mockResolvedValue(product);

            const result =
                await updateProductService(
                    productId,
                    {
                        sku: product.sku
                    }
                );

            expect(
                mockedUpdateProductRepository
            ).toHaveBeenCalled();

            expect(result).toEqual(
                product
            );
        });

        it("should reject duplicate product name during update", async () => {
            mockedFindProductByIdRepository
                .mockResolvedValue(product);

            mockedFindProductBySlugRepository
                .mockResolvedValue({
                    ...product,
                    id: "another-product-id"
                });

            await expect(
                updateProductService(
                    productId,
                    {
                        name: "Another Product"
                    }
                )
            ).rejects.toThrow(
                "Product with this name already exists"
            );

            expect(
                mockedUpdateProductRepository
            ).not.toHaveBeenCalled();
        });

        it("should reject non-existing category during update", async () => {
            mockedFindProductByIdRepository
                .mockResolvedValue(product);

            mockedFindCategoryById
                .mockResolvedValue([]);

            await expect(
                updateProductService(
                    productId,
                    {
                        categoryIds: [
                            categoryId
                        ]
                    }
                )
            ).rejects.toThrow(
                `Category ${categoryId} does not exist`
            );

            expect(
                mockedUpdateProductRepository
            ).not.toHaveBeenCalled();
        });

        it("should reject inactive category during update", async () => {
            mockedFindProductByIdRepository
                .mockResolvedValue(product);

            mockedFindCategoryById
                .mockResolvedValue([
                    inactiveCategory
                ]);

            await expect(
                updateProductService(
                    productId,
                    {
                        categoryIds: [
                            categoryId
                        ]
                    }
                )
            ).rejects.toThrow(
                `Category ${categoryId} is inactive`
            );

            expect(
                mockedUpdateProductRepository
            ).not.toHaveBeenCalled();
        });

        it("should update categories successfully", async () => {
            mockedFindProductByIdRepository
                .mockResolvedValue(product);

            mockedFindCategoryById
                .mockResolvedValue([
                    activeCategory
                ]);

            const updatedProduct = {
                ...product,
                categoryIds: [
                    secondCategoryId
                ]
            };

            mockedUpdateProductRepository
                .mockResolvedValue(
                    updatedProduct
                );

            const result =
                await updateProductService(
                    productId,
                    {
                        categoryIds: [
                            secondCategoryId
                        ]
                    }
                );

            expect(
                mockedFindCategoryById
            ).toHaveBeenCalledWith(
                secondCategoryId
            );

            expect(
                mockedUpdateProductRepository
            ).toHaveBeenCalled();

            expect(result).toEqual(
                updatedProduct
            );
        });
    });

    describe("deleteProductService", () => {
        it("should delete product successfully", async () => {
            mockedFindProductByIdRepository
                .mockResolvedValue(product);

            mockedDeleteProductRepository
                .mockResolvedValue(
                    undefined
                );

            const result =
                await deleteProductService(
                    productId
                );

            expect(
                mockedFindProductByIdRepository
            ).toHaveBeenCalledWith(
                productId
            );

            expect(
                mockedDeleteProductRepository
            ).toHaveBeenCalledWith(
                productId
            );

            expect(result).toEqual({
                message:
                    "Product deleted successfully"
            });
        });

        it("should reject when product does not exist", async () => {
            mockedFindProductByIdRepository
                .mockResolvedValue(null);

            await expect(
                deleteProductService(
                    productId
                )
            ).rejects.toThrow(
                "Product not found"
            );

            expect(
                mockedDeleteProductRepository
            ).not.toHaveBeenCalled();
        });

        it("should reject when product is already inactive", async () => {
            mockedFindProductByIdRepository
                .mockResolvedValue({
                    ...product,
                    status: "INACTIVE"
                });

            await expect(
                deleteProductService(
                    productId
                )
            ).rejects.toThrow(
                "Product is already inactive"
            );

            expect(
                mockedDeleteProductRepository
            ).not.toHaveBeenCalled();
        });
    });
});