import {
    CreateCategoryDto
} from "../../dtos/category/create-category.dto";

export const validateCreateCategory = (
    data: CreateCategoryDto
): string[] => {
    const errors: string[] = [];

    if (
        !data ||
        typeof data !== "object"
    ) {
        return ["Request body is required"];
    }

    if (
        typeof data.name !== "string" ||
        data.name.trim().length === 0
    ) {
        errors.push(
            "Category name is required"
        );
    } else if (
        data.name.trim().length > 150
    ) {
        errors.push(
            "Category name must not exceed 150 characters"
        );
    }

    if (
        data.description !== undefined &&
        typeof data.description !== "string"
    ) {
        errors.push(
            "Category description must be a string"
        );
    }

    if (
        data.parentId !== undefined &&
        (
            typeof data.parentId !== "string" ||
            data.parentId.trim().length === 0
        )
    ) {
        errors.push(
            "Parent category ID must be a valid string"
        );
    }

    return errors;
};