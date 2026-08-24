import { AppError } from "../../utils/app-error";
import { CreateProductDto } from "../../dtos/product/create-product.dto";

const isValidUuid = (value: string): boolean => {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        value
    );
};

export const validateCreateProduct = (
    data: CreateProductDto
): void => {
    if (!data || typeof data !== "object") {
        throw new AppError(
            "Product data is required",
            400
        );
    }

    if (
        typeof data.name !== "string" ||
        !data.name.trim()
    ) {
        throw new AppError(
            "Product name is required",
            400
        );
    }

    if (
        data.name.trim().length < 2 ||
        data.name.trim().length > 255
    ) {
        throw new AppError(
            "Product name must be between 2 and 255 characters",
            400
        );
    }

    if (
        data.slug !== undefined &&
        (
            typeof data.slug !== "string" ||
            !data.slug.trim()
        )
    ) {
        throw new AppError(
            "Product slug must be a valid string",
            400
        );
    }

    if (
        data.description !== undefined &&
        typeof data.description !== "string"
    ) {
        throw new AppError(
            "Product description must be a string",
            400
        );
    }

    if (
        typeof data.price !== "number" ||
        !Number.isFinite(data.price) ||
        data.price <= 0
    ) {
        throw new AppError(
            "Product price must be greater than 0",
            400
        );
    }

    if (
        typeof data.sku !== "string" ||
        !data.sku.trim()
    ) {
        throw new AppError(
            "Product SKU is required",
            400
        );
    }

    if (
        data.sku.trim().length < 2 ||
        data.sku.trim().length > 100
    ) {
        throw new AppError(
            "Product SKU must be between 2 and 100 characters",
            400
        );
    }

    if (
        typeof data.stockQuantity !== "number" ||
        !Number.isInteger(data.stockQuantity) ||
        data.stockQuantity < 0
    ) {
        throw new AppError(
            "Stock quantity must be a non-negative integer",
            400
        );
    }

    if (
        !Array.isArray(data.categoryIds) ||
        data.categoryIds.length === 0
    ) {
        throw new AppError(
            "At least one category is required",
            400
        );
    }

    const uniqueCategoryIds =
        new Set(data.categoryIds);

    if (
        uniqueCategoryIds.size !==
        data.categoryIds.length
    ) {
        throw new AppError(
            "Duplicate category IDs are not allowed",
            400
        );
    }

    for (const categoryId of data.categoryIds) {
        if (
            typeof categoryId !== "string" ||
            !isValidUuid(categoryId)
        ) {
            throw new AppError(
                "Each category ID must be a valid UUID",
                400
            );
        }
    }
};