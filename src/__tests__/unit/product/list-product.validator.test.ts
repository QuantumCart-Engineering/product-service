import {
    validateListProduct,
    ListProductQuery
} from "../../../validators/product/list-product.validator";

describe("validateListProduct", () => {
    const validCategoryId =
        "550e8400-e29b-41d4-a716-446655440000";

    it("should accept empty query", () => {
        expect(() =>
            validateListProduct({})
        ).not.toThrow();
    });

    it("should accept valid limit", () => {
        expect(() =>
            validateListProduct({
                limit: 20
            })
        ).not.toThrow();
    });

    it("should accept limit of 1", () => {
        expect(() =>
            validateListProduct({
                limit: 1
            })
        ).not.toThrow();
    });

    it("should accept limit of 100", () => {
        expect(() =>
            validateListProduct({
                limit: 100
            })
        ).not.toThrow();
    });

    it("should accept valid cursor", () => {
        expect(() =>
            validateListProduct({
                cursor: "eyJpZCI6IjEyMyJ9"
            })
        ).not.toThrow();
    });

    it("should accept valid category filter", () => {
        expect(() =>
            validateListProduct({
                categoryId:
                    validCategoryId
            })
        ).not.toThrow();
    });

    it("should accept valid search", () => {
        expect(() =>
            validateListProduct({
                search: "iphone"
            })
        ).not.toThrow();
    });

    it("should accept valid price range", () => {
        expect(() =>
            validateListProduct({
                minPrice: 1000,
                maxPrice: 50000
            })
        ).not.toThrow();
    });

    it("should reject invalid query data", () => {
        expect(() =>
            validateListProduct(
                undefined as never
            )
        ).toThrow(
            "Product list query is required"
        );
    });

    it("should reject invalid cursor", () => {
        expect(() =>
            validateListProduct({
                cursor: 123 as never
            })
        ).toThrow(
            "Cursor must be a valid string"
        );
    });

    it("should reject empty cursor", () => {
        expect(() =>
            validateListProduct({
                cursor: ""
            })
        ).toThrow(
            "Cursor must be a valid string"
        );
    });

    it("should reject non-integer limit", () => {
        expect(() =>
            validateListProduct({
                limit: 10.5
            })
        ).toThrow(
            "Limit must be an integer"
        );
    });

    it("should reject limit below 1", () => {
        expect(() =>
            validateListProduct({
                limit: 0
            })
        ).toThrow(
            "Limit must be between 1 and 100"
        );
    });

    it("should reject limit above 100", () => {
        expect(() =>
            validateListProduct({
                limit: 101
            })
        ).toThrow(
            "Limit must be between 1 and 100"
        );
    });

    it("should reject invalid category ID", () => {
        expect(() =>
            validateListProduct({
                categoryId:
                    "invalid-id"
            })
        ).toThrow(
            "Category ID must be a valid UUID"
        );
    });

    it("should reject non-string search", () => {
        expect(() =>
            validateListProduct({
                search: 123 as never
            })
        ).toThrow(
            "Search must be a valid string"
        );
    });

    it("should reject negative minimum price", () => {
        expect(() =>
            validateListProduct({
                minPrice: -1
            })
        ).toThrow(
            "Minimum price must be a non-negative number"
        );
    });

    it("should reject negative maximum price", () => {
        expect(() =>
            validateListProduct({
                maxPrice: -1
            })
        ).toThrow(
            "Maximum price must be a non-negative number"
        );
    });

    it("should reject invalid minimum price", () => {
        expect(() =>
            validateListProduct({
                minPrice: "1000" as never
            })
        ).toThrow(
            "Minimum price must be a non-negative number"
        );
    });

    it("should reject invalid maximum price", () => {
        expect(() =>
            validateListProduct({
                maxPrice: "50000" as never
            })
        ).toThrow(
            "Maximum price must be a non-negative number"
        );
    });

    it("should reject min price greater than max price", () => {
        expect(() =>
            validateListProduct({
                minPrice: 50000,
                maxPrice: 1000
            })
        ).toThrow(
            "Minimum price cannot be greater than maximum price"
        );
    });

    it("should accept complete valid query", () => {
        const query: ListProductQuery = {
            cursor: "eyJpZCI6IjEyMyJ9",
            limit: 20,
            categoryId:
                validCategoryId,
            search: "iphone",
            minPrice: 1000,
            maxPrice: 100000
        };

        expect(() =>
            validateListProduct(query)
        ).not.toThrow();
    });
});