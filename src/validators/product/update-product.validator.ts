import { AppError } from "../../utils/app-error";
import { UpdateProductDto } from "../../dtos/product/update-product.dto";

const isValidUuid = (value: string): boolean => {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        value
    );
};

export const validateUpdateProduct = (
    data: UpdateProductDto
): void => {
    if (!data || typeof data !== "object") {
        throw new AppError(
            "Product update data is required",
            400
        );
    }

    if (
        data.name !== undefined &&
        (
            typeof data.name !== "string" ||
            !data.name.trim()
        )
    ) {
        throw new AppError(
            "Product name must be a valid string",
            400
        );
    }

    if (
        data.name !== undefined &&
        (
            data.name.trim().length < 2 ||
            data.name.trim().length > 255
        )
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
        data.price !== undefined &&
        (
            typeof data.price !== "number" ||
            !Number.isFinite(data.price) ||
            data.price <= 0
        )
    ) {
        throw new AppError(
            "Product price must be greater than 0",
            400
        );
    }

    if (
        data.sku !== undefined &&
        (
            typeof data.sku !== "string" ||
            !data.sku.trim()
        )
    ) {
        throw new AppError(
            "Product SKU must be a valid string",
            400
        );
    }

    if (
        data.sku !== undefined &&
        (
            data.sku.trim().length < 2 ||
            data.sku.trim().length > 100
        )
    ) {
        throw new AppError(
            "Product SKU must be between 2 and 100 characters",
            400
        );
    }

    if (
        data.stockQuantity !== undefined &&
        (
            typeof data.stockQuantity !== "number" ||
            !Number.isInteger(data.stockQuantity) ||
            data.stockQuantity < 0
        )
    ) {
        throw new AppError(
            "Stock quantity must be a non-negative integer",
            400
        );
    }

    if (data.categoryIds !== undefined) {
        if (
            !Array.isArray(data.categoryIds) ||
            data.categoryIds.length === 0
        ) {
            throw new AppError(
                "Category IDs must contain at least one category",
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

        for (
            const categoryId of data.categoryIds
        ) {
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
    }

    const hasUpdate =
        data.name !== undefined ||
        data.slug !== undefined ||
        data.description !== undefined ||
        data.price !== undefined ||
        data.sku !== undefined ||
        data.stockQuantity !== undefined ||
        data.categoryIds !== undefined;

    if (!hasUpdate) {
        throw new AppError(
            "At least one field is required for update",
            400
        );
    }
};