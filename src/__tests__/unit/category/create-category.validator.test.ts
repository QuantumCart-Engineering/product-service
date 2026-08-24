import {
    validateCreateCategory
} from "../../../validators/category/create-category.validator";

describe("validateCreateCategory", () => {
    it("should return no errors for valid category data", () => {
        const result =
            validateCreateCategory({
                name: "Electronics",
                description:
                    "Electronic products",
                parentId:
                    "550e8400-e29b-41d4-a716-446655440001"
            });

        expect(result).toEqual([]);
    });

    it("should return error when request body is missing", () => {
        const result =
            validateCreateCategory(
                undefined as any
            );

        expect(result).toEqual([
            "Request body is required"
        ]);
    });

    it("should return error when request body is null", () => {
        const result =
            validateCreateCategory(
                null as any
            );

        expect(result).toEqual([
            "Request body is required"
        ]);
    });

    it("should return error when category name is missing", () => {
        const result =
            validateCreateCategory({
                description:
                    "Electronics category"
            } as any);

        expect(result).toContain(
            "Category name is required"
        );
    });

    it("should return error when category name is not a string", () => {
        const result =
            validateCreateCategory({
                name: 123
            } as any);

        expect(result).toContain(
            "Category name is required"
        );
    });

    it("should return error when category name is empty", () => {
        const result =
            validateCreateCategory({
                name: ""
            });

        expect(result).toContain(
            "Category name is required"
        );
    });

    it("should return error when category name contains only spaces", () => {
        const result =
            validateCreateCategory({
                name: "   "
            });

        expect(result).toContain(
            "Category name is required"
        );
    });

    it("should return error when category name exceeds 150 characters", () => {
        const result =
            validateCreateCategory({
                name: "a".repeat(151)
            });

        expect(result).toContain(
            "Category name must not exceed 150 characters"
        );
    });

    it("should accept category name with exactly 150 characters", () => {
        const result =
            validateCreateCategory({
                name: "a".repeat(150)
            });

        expect(result).toEqual([]);
    });

    it("should return error when description is not a string", () => {
        const result =
            validateCreateCategory({
                name: "Electronics",
                description: 123
            } as any);

        expect(result).toContain(
            "Category description must be a string"
        );
    });

    it("should accept undefined description", () => {
        const result =
            validateCreateCategory({
                name: "Electronics"
            });

        expect(result).toEqual([]);
    });

    it("should return error when parentId is not a string", () => {
        const result =
            validateCreateCategory({
                name: "Mobile Phones",
                parentId: 123
            } as any);

        expect(result).toContain(
            "Parent category ID must be a valid string"
        );
    });

    it("should return error when parentId is empty", () => {
        const result =
            validateCreateCategory({
                name: "Mobile Phones",
                parentId: ""
            });

        expect(result).toContain(
            "Parent category ID must be a valid string"
        );
    });

    it("should return error when parentId contains only spaces", () => {
        const result =
            validateCreateCategory({
                name: "Mobile Phones",
                parentId: "   "
            });

        expect(result).toContain(
            "Parent category ID must be a valid string"
        );
    });

    it("should accept undefined parentId", () => {
        const result =
            validateCreateCategory({
                name: "Electronics",
                parentId: undefined
            });

        expect(result).toEqual([]);
    });

    it("should return multiple validation errors when multiple fields are invalid", () => {
        const result =
            validateCreateCategory({
                name: "",
                description: 123,
                parentId: 456
            } as any);

        expect(result).toEqual([
            "Category name is required",
            "Category description must be a string",
            "Parent category ID must be a valid string"
        ]);
    });
});