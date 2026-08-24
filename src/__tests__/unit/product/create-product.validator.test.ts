import { validateCreateProduct } from "../../../validators/product/create-product.validator";

describe("validateCreateProduct", () => {
    const validProduct = {
        name: "iPhone 17",
        description: "Latest Apple smartphone",
        price: 79999,
        sku: "IPH17-128-BLK",
        stockQuantity: 50,
        categoryIds: [
            "550e8400-e29b-41d4-a716-446655440000"
        ]
    };

    it("should accept valid product data", () => {
        expect(() =>
            validateCreateProduct(validProduct)
        ).not.toThrow();
    });

    it("should reject missing product data", () => {
        expect(() =>
            validateCreateProduct(
                undefined as never
            )
        ).toThrow(
            "Product data is required"
        );
    });

    it("should reject missing product name", () => {
        expect(() =>
            validateCreateProduct({
                ...validProduct,
                name: ""
            })
        ).toThrow(
            "Product name is required"
        );
    });

    it("should reject name shorter than 2 characters", () => {
        expect(() =>
            validateCreateProduct({
                ...validProduct,
                name: "A"
            })
        ).toThrow(
            "Product name must be between 2 and 255 characters"
        );
    });

    it("should reject name longer than 255 characters", () => {
        expect(() =>
            validateCreateProduct({
                ...validProduct,
                name: "A".repeat(256)
            })
        ).toThrow(
            "Product name must be between 2 and 255 characters"
        );
    });

    it("should reject invalid slug", () => {
        expect(() =>
            validateCreateProduct({
                ...validProduct,
                slug: 123 as never
            })
        ).toThrow(
            "Product slug must be a valid string"
        );
    });

    it("should reject invalid description", () => {
        expect(() =>
            validateCreateProduct({
                ...validProduct,
                description: 123 as never
            })
        ).toThrow(
            "Product description must be a string"
        );
    });

    it("should reject zero price", () => {
        expect(() =>
            validateCreateProduct({
                ...validProduct,
                price: 0
            })
        ).toThrow(
            "Product price must be greater than 0"
        );
    });

    it("should reject negative price", () => {
        expect(() =>
            validateCreateProduct({
                ...validProduct,
                price: -100
            })
        ).toThrow(
            "Product price must be greater than 0"
        );
    });

    it("should reject non-numeric price", () => {
        expect(() =>
            validateCreateProduct({
                ...validProduct,
                price: "79999" as never
            })
        ).toThrow(
            "Product price must be greater than 0"
        );
    });

    it("should reject missing SKU", () => {
        expect(() =>
            validateCreateProduct({
                ...validProduct,
                sku: ""
            })
        ).toThrow(
            "Product SKU is required"
        );
    });

    it("should reject SKU shorter than 2 characters", () => {
        expect(() =>
            validateCreateProduct({
                ...validProduct,
                sku: "A"
            })
        ).toThrow(
            "Product SKU must be between 2 and 100 characters"
        );
    });

    it("should reject SKU longer than 100 characters", () => {
        expect(() =>
            validateCreateProduct({
                ...validProduct,
                sku: "A".repeat(101)
            })
        ).toThrow(
            "Product SKU must be between 2 and 100 characters"
        );
    });

    it("should reject negative stock quantity", () => {
        expect(() =>
            validateCreateProduct({
                ...validProduct,
                stockQuantity: -1
            })
        ).toThrow(
            "Stock quantity must be a non-negative integer"
        );
    });

    it("should reject decimal stock quantity", () => {
        expect(() =>
            validateCreateProduct({
                ...validProduct,
                stockQuantity: 10.5
            })
        ).toThrow(
            "Stock quantity must be a non-negative integer"
        );
    });

    it("should accept zero stock quantity", () => {
        expect(() =>
            validateCreateProduct({
                ...validProduct,
                stockQuantity: 0
            })
        ).not.toThrow();
    });

    it("should reject missing category IDs", () => {
        expect(() =>
            validateCreateProduct({
                ...validProduct,
                categoryIds: []
            })
        ).toThrow(
            "At least one category is required"
        );
    });

    it("should reject duplicate category IDs", () => {
        const categoryId =
            "550e8400-e29b-41d4-a716-446655440000";

        expect(() =>
            validateCreateProduct({
                ...validProduct,
                categoryIds: [
                    categoryId,
                    categoryId
                ]
            })
        ).toThrow(
            "Duplicate category IDs are not allowed"
        );
    });

    it("should reject invalid category UUID", () => {
        expect(() =>
            validateCreateProduct({
                ...validProduct,
                categoryIds: [
                    "invalid-category-id"
                ]
            })
        ).toThrow(
            "Each category ID must be a valid UUID"
        );
    });

    it("should reject non-array category IDs", () => {
        expect(() =>
            validateCreateProduct({
                ...validProduct,
                categoryIds:
                    "550e8400-e29b-41d4-a716-446655440000" as never
            })
        ).toThrow(
            "At least one category is required"
        );
    });
});