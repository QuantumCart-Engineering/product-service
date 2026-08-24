import { validateUpdateProduct } from "../../../validators/product/update-product.validator";

describe("validateUpdateProduct", () => {
    const validCategoryId =
        "550e8400-e29b-41d4-a716-446655440000";

    it("should accept a valid partial update", () => {
        expect(() =>
            validateUpdateProduct({
                name: "Updated iPhone"
            })
        ).not.toThrow();
    });

    it("should accept valid price update", () => {
        expect(() =>
            validateUpdateProduct({
                price: 89999
            })
        ).not.toThrow();
    });

    it("should accept valid stock update", () => {
        expect(() =>
            validateUpdateProduct({
                stockQuantity: 100
            })
        ).not.toThrow();
    });

    it("should accept valid category update", () => {
        expect(() =>
            validateUpdateProduct({
                categoryIds: [
                    validCategoryId
                ]
            })
        ).not.toThrow();
    });

    it("should reject missing update data", () => {
        expect(() =>
            validateUpdateProduct(
                undefined as never
            )
        ).toThrow(
            "Product update data is required"
        );
    });

    it("should reject empty update object", () => {
        expect(() =>
            validateUpdateProduct({})
        ).toThrow(
            "At least one field is required for update"
        );
    });

    it("should reject invalid name", () => {
        expect(() =>
            validateUpdateProduct({
                name: ""
            })
        ).toThrow(
            "Product name must be a valid string"
        );
    });

    it("should reject name shorter than 2 characters", () => {
        expect(() =>
            validateUpdateProduct({
                name: "A"
            })
        ).toThrow(
            "Product name must be between 2 and 255 characters"
        );
    });

    it("should reject name longer than 255 characters", () => {
        expect(() =>
            validateUpdateProduct({
                name: "A".repeat(256)
            })
        ).toThrow(
            "Product name must be between 2 and 255 characters"
        );
    });

    it("should reject invalid slug", () => {
        expect(() =>
            validateUpdateProduct({
                slug: 123 as never
            })
        ).toThrow(
            "Product slug must be a valid string"
        );
    });

    it("should reject invalid description", () => {
        expect(() =>
            validateUpdateProduct({
                description: 123 as never
            })
        ).toThrow(
            "Product description must be a string"
        );
    });

    it("should reject zero price", () => {
        expect(() =>
            validateUpdateProduct({
                price: 0
            })
        ).toThrow(
            "Product price must be greater than 0"
        );
    });

    it("should reject negative price", () => {
        expect(() =>
            validateUpdateProduct({
                price: -100
            })
        ).toThrow(
            "Product price must be greater than 0"
        );
    });

    it("should reject invalid SKU", () => {
        expect(() =>
            validateUpdateProduct({
                sku: ""
            })
        ).toThrow(
            "Product SKU must be a valid string"
        );
    });

    it("should reject SKU longer than 100 characters", () => {
        expect(() =>
            validateUpdateProduct({
                sku: "A".repeat(101)
            })
        ).toThrow(
            "Product SKU must be between 2 and 100 characters"
        );
    });

    it("should reject negative stock quantity", () => {
        expect(() =>
            validateUpdateProduct({
                stockQuantity: -1
            })
        ).toThrow(
            "Stock quantity must be a non-negative integer"
        );
    });

    it("should reject decimal stock quantity", () => {
        expect(() =>
            validateUpdateProduct({
                stockQuantity: 10.5
            })
        ).toThrow(
            "Stock quantity must be a non-negative integer"
        );
    });

    it("should reject empty category IDs", () => {
        expect(() =>
            validateUpdateProduct({
                categoryIds: []
            })
        ).toThrow(
            "Category IDs must contain at least one category"
        );
    });

    it("should reject duplicate category IDs", () => {
        expect(() =>
            validateUpdateProduct({
                categoryIds: [
                    validCategoryId,
                    validCategoryId
                ]
            })
        ).toThrow(
            "Duplicate category IDs are not allowed"
        );
    });

    it("should reject invalid category UUID", () => {
        expect(() =>
            validateUpdateProduct({
                categoryIds: [
                    "invalid-id"
                ]
            })
        ).toThrow(
            "Each category ID must be a valid UUID"
        );
    });
});