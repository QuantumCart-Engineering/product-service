import {
    Request,
    Response
} from "express";

import {
    createProductService,
    getProductByIdService,
    getProductsService,
    updateProductService,
    deleteProductService
} from "../../../services/product.service";

import {
    createProductController,
    getProductByIdController,
    getProductsController,
    updateProductController,
    deleteProductController
} from "../../../controllers/product.controller";

jest.mock(
    "../../../services/product.service",
    () => ({
        createProductService:
            jest.fn(),
        getProductByIdService:
            jest.fn(),
        getProductsService:
            jest.fn(),
        updateProductService:
            jest.fn(),
        deleteProductService:
            jest.fn()
    })
);

const mockedCreateProductService =
    createProductService as jest.Mock;

const mockedGetProductByIdService =
    getProductByIdService as jest.Mock;

const mockedGetProductsService =
    getProductsService as jest.Mock;

const mockedUpdateProductService =
    updateProductService as jest.Mock;

const mockedDeleteProductService =
    deleteProductService as jest.Mock;

describe("Product Controller", () => {
    const productId =
        "550e8400-e29b-41d4-a716-446655440001";

    const categoryId =
        "550e8400-e29b-41d4-a716-446655440002";

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

    const createData = {
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

    const createMockResponse = () => {
        const response =
            {} as Response;

        response.status =
            jest.fn().mockReturnValue(
                response
            );

        response.json =
            jest.fn().mockReturnValue(
                response
            );

        return response;
    };

    const createMockRequest = (
        overrides: Partial<Request> = {}
    ) => {
        return {
            body: {},
            query: {},
            params: {},
            ...overrides
        } as Request;
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("createProductController", () => {
        it("should create product successfully", async () => {
            const req =
                createMockRequest({
                    body: createData
                });

            const res =
                createMockResponse();

            mockedCreateProductService
                .mockResolvedValue(
                    product
                );

            await createProductController(
                req,
                res
            );

            expect(
                mockedCreateProductService
            ).toHaveBeenCalledWith(
                createData
            );

            expect(
                res.status
            ).toHaveBeenCalledWith(
                201
            );

            expect(
                res.json
            ).toHaveBeenCalledWith({
                success: true,
                message:
                    "Product created successfully",
                data: product
            });
        });

        it("should not call service when validation fails", async () => {
            const req =
                createMockRequest({
                    body: {
                        name: "",
                        price: 79999,
                        sku: "SKU-1",
                        stockQuantity: 10,
                        categoryIds: [
                            categoryId
                        ]
                    }
                });

            const res =
                createMockResponse();

            await expect(
                createProductController(
                    req,
                    res
                )
            ).rejects.toThrow(
                "Product name is required"
            );

            expect(
                mockedCreateProductService
            ).not.toHaveBeenCalled();
        });

        it("should propagate service error", async () => {
            const req =
                createMockRequest({
                    body: createData
                });

            const res =
                createMockResponse();

            mockedCreateProductService
                .mockRejectedValue(
                    new Error(
                        "Product creation failed"
                    )
                );

            await expect(
                createProductController(
                    req,
                    res
                )
            ).rejects.toThrow(
                "Product creation failed"
            );
        });
    });

    describe("getProductsController", () => {
        it("should return products successfully", async () => {
            const req =
                createMockRequest({
                    query: {}
                });

            const res =
                createMockResponse();

            mockedGetProductsService
                .mockResolvedValue({
                    products: [
                        product
                    ],
                    hasMore: false
                });

            await getProductsController(
                req,
                res
            );

            expect(
                mockedGetProductsService
            ).toHaveBeenCalledWith({
                limit: 20,
                cursor: undefined,
                categoryId:
                    undefined,
                search:
                    undefined
            });

            expect(
                res.status
            ).toHaveBeenCalledWith(
                200
            );

            expect(
                res.json
            ).toHaveBeenCalledWith({
                success: true,
                data: [
                    product
                ],
                pagination: {
                    limit: 20,
                    hasMore: false,
                    nextCursor: null
                }
            });
        });

        it("should parse limit correctly", async () => {
            const req =
                createMockRequest({
                    query: {
                        limit: "10"
                    }
                });

            const res =
                createMockResponse();

            mockedGetProductsService
                .mockResolvedValue({
                    products: [
                        product
                    ],
                    hasMore: false
                });

            await getProductsController(
                req,
                res
            );

            expect(
                mockedGetProductsService
            ).toHaveBeenCalledWith({
                limit: 10,
                cursor: undefined,
                categoryId:
                    undefined,
                search:
                    undefined
            });

            expect(
                res.json
            ).toHaveBeenCalledWith(
                expect.objectContaining({
                    pagination:
                        expect.objectContaining({
                            limit: 10
                        })
                })
            );
        });

        it("should pass category filter to service", async () => {
            const req =
                createMockRequest({
                    query: {
                        categoryId
                    }
                });

            const res =
                createMockResponse();

            mockedGetProductsService
                .mockResolvedValue({
                    products: [
                        product
                    ],
                    hasMore: false
                });

            await getProductsController(
                req,
                res
            );

            expect(
                mockedGetProductsService
            ).toHaveBeenCalledWith({
                limit: 20,
                cursor: undefined,
                categoryId,
                search:
                    undefined
            });
        });

        it("should pass search filter to service", async () => {
            const req =
                createMockRequest({
                    query: {
                        search: "iphone"
                    }
                });

            const res =
                createMockResponse();

            mockedGetProductsService
                .mockResolvedValue({
                    products: [
                        product
                    ],
                    hasMore: false
                });

            await getProductsController(
                req,
                res
            );

            expect(
                mockedGetProductsService
            ).toHaveBeenCalledWith({
                limit: 20,
                cursor: undefined,
                categoryId:
                    undefined,
                search: "iphone"
            });
        });

        it("should reject invalid limit", async () => {
            const req =
                createMockRequest({
                    query: {
                        limit: "101"
                    }
                });

            const res =
                createMockResponse();

            await expect(
                getProductsController(
                    req,
                    res
                )
            ).rejects.toThrow(
                "Limit must be between 1 and 100"
            );

            expect(
                mockedGetProductsService
            ).not.toHaveBeenCalled();
        });

        it("should reject invalid category ID", async () => {
            const req =
                createMockRequest({
                    query: {
                        categoryId:
                            "invalid-id"
                    }
                });

            const res =
                createMockResponse();

            await expect(
                getProductsController(
                    req,
                    res
                )
            ).rejects.toThrow(
                "Category ID must be a valid UUID"
            );

            expect(
                mockedGetProductsService
            ).not.toHaveBeenCalled();
        });

        it("should reject invalid price range", async () => {
            const req =
                createMockRequest({
                    query: {
                        minPrice: "1000",
                        maxPrice: "500"
                    }
                });

            const res =
                createMockResponse();

            await expect(
                getProductsController(
                    req,
                    res
                )
            ).rejects.toThrow(
                "Minimum price cannot be greater than maximum price"
            );

            expect(
                mockedGetProductsService
            ).not.toHaveBeenCalled();
        });

        it("should return next cursor when more products are available", async () => {
            const products =
                Array.from(
                    {
                        length: 20
                    },
                    (_, index) => ({
                        ...product,
                        id:
                            `550e8400-e29b-41d4-a716-44665544000${index % 9 + 1}`
                    })
                );

            const req =
                createMockRequest({
                    query: {
                        limit: "20"
                    }
                });

            const res =
                createMockResponse();

            mockedGetProductsService
                .mockResolvedValue({
                    products,
                    hasMore: true
                });

            await getProductsController(
                req,
                res
            );

            expect(
                res.json
            ).toHaveBeenCalledWith(
                expect.objectContaining({
                    pagination:
                        expect.objectContaining({
                            limit: 20,
                            hasMore: true,
                            nextCursor:
                                expect.any(
                                    String
                                )
                        })
                })
            );
        });

        it("should reject invalid cursor", async () => {
            const req =
                createMockRequest({
                    query: {
                        cursor:
                            "invalid-cursor"
                    }
                });

            const res =
                createMockResponse();

            await expect(
                getProductsController(
                    req,
                    res
                )
            ).rejects.toThrow(
                "Invalid cursor"
            );

            expect(
                mockedGetProductsService
            ).not.toHaveBeenCalled();
        });
    });

    describe("getProductByIdController", () => {
        it("should return product successfully", async () => {
            const req =
                createMockRequest({
                    params: {
                        id: productId
                    }
                });

            const res =
                createMockResponse();

            mockedGetProductByIdService
                .mockResolvedValue(
                    product
                );

            await getProductByIdController(
                req,
                res
            );

            expect(
                mockedGetProductByIdService
            ).toHaveBeenCalledWith(
                productId
            );

            expect(
                res.status
            ).toHaveBeenCalledWith(
                200
            );

            expect(
                res.json
            ).toHaveBeenCalledWith({
                success: true,
                data: product
            });
        });

        it("should reject when product ID is missing", async () => {
            const req =
                createMockRequest({
                    params: {}
                });

            const res =
                createMockResponse();

            await expect(
                getProductByIdController(
                    req,
                    res
                )
            ).rejects.toThrow(
                "Product ID is required"
            );

            expect(
                mockedGetProductByIdService
            ).not.toHaveBeenCalled();
        });

        it("should propagate service error", async () => {
            const req =
                createMockRequest({
                    params: {
                        id: productId
                    }
                });

            const res =
                createMockResponse();

            mockedGetProductByIdService
                .mockRejectedValue(
                    new Error(
                        "Product not found"
                    )
                );

            await expect(
                getProductByIdController(
                    req,
                    res
                )
            ).rejects.toThrow(
                "Product not found"
            );
        });
    });

    describe("updateProductController", () => {
        it("should update product successfully", async () => {
            const updateData = {
                name: "iPhone 17 Pro"
            };

            const updatedProduct = {
                ...product,
                name: "iPhone 17 Pro",
                slug: "iphone-17-pro"
            };

            const req =
                createMockRequest({
                    params: {
                        id: productId
                    },
                    body: updateData
                });

            const res =
                createMockResponse();

            mockedUpdateProductService
                .mockResolvedValue(
                    updatedProduct
                );

            await updateProductController(
                req,
                res
            );

            expect(
                mockedUpdateProductService
            ).toHaveBeenCalledWith(
                productId,
                updateData
            );

            expect(
                res.status
            ).toHaveBeenCalledWith(
                200
            );

            expect(
                res.json
            ).toHaveBeenCalledWith({
                success: true,
                message:
                    "Product updated successfully",
                data:
                    updatedProduct
            });
        });

        it("should reject invalid update data", async () => {
            const req =
                createMockRequest({
                    params: {
                        id: productId
                    },
                    body: {}
                });

            const res =
                createMockResponse();

            await expect(
                updateProductController(
                    req,
                    res
                )
            ).rejects.toThrow(
                "At least one field is required for update"
            );

            expect(
                mockedUpdateProductService
            ).not.toHaveBeenCalled();
        });

        it("should reject when product ID is missing", async () => {
            const req =
                createMockRequest({
                    params: {},
                    body: {
                        name: "Updated Product"
                    }
                });

            const res =
                createMockResponse();

            await expect(
                updateProductController(
                    req,
                    res
                )
            ).rejects.toThrow(
                "Product ID is required"
            );

            expect(
                mockedUpdateProductService
            ).not.toHaveBeenCalled();
        });

        it("should propagate service error", async () => {
            const req =
                createMockRequest({
                    params: {
                        id: productId
                    },
                    body: {
                        name: "Updated Product"
                    }
                });

            const res =
                createMockResponse();

            mockedUpdateProductService
                .mockRejectedValue(
                    new Error(
                        "Product not found"
                    )
                );

            await expect(
                updateProductController(
                    req,
                    res
                )
            ).rejects.toThrow(
                "Product not found"
            );
        });
    });

    describe("deleteProductController", () => {
        it("should delete product successfully", async () => {
            const req =
                createMockRequest({
                    params: {
                        id: productId
                    }
                });

            const res =
                createMockResponse();

            mockedDeleteProductService
                .mockResolvedValue({
                    message:
                        "Product deleted successfully"
                });

            await deleteProductController(
                req,
                res
            );

            expect(
                mockedDeleteProductService
            ).toHaveBeenCalledWith(
                productId
            );

            expect(
                res.status
            ).toHaveBeenCalledWith(
                200
            );

            expect(
                res.json
            ).toHaveBeenCalledWith({
                success: true,
                message:
                    "Product deleted successfully"
            });
        });

        it("should reject when product ID is missing", async () => {
            const req =
                createMockRequest({
                    params: {}
                });

            const res =
                createMockResponse();

            await expect(
                deleteProductController(
                    req,
                    res
                )
            ).rejects.toThrow(
                "Product ID is required"
            );

            expect(
                mockedDeleteProductService
            ).not.toHaveBeenCalled();
        });

        it("should propagate service error", async () => {
            const req =
                createMockRequest({
                    params: {
                        id: productId
                    }
                });

            const res =
                createMockResponse();

            mockedDeleteProductService
                .mockRejectedValue(
                    new Error(
                        "Product is already inactive"
                    )
                );

            await expect(
                deleteProductController(
                    req,
                    res
                )
            ).rejects.toThrow(
                "Product is already inactive"
            );
        });
    });
});