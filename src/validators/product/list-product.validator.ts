import { AppError } from "../../utils/app-error";

export interface ListProductQuery {
    cursor?: string;
    limit?: number;
    categoryId?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
}

const isValidUuid = (value: string): boolean => {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        value
    );
};

export const validateListProduct = (
    data: ListProductQuery
): void => {
    if (!data || typeof data !== "object") {
        throw new AppError(
            "Product list query is required",
            400
        );
    }

    if (
        data.cursor !== undefined &&
        (
            typeof data.cursor !== "string" ||
            !data.cursor.trim()
        )
    ) {
        throw new AppError(
            "Cursor must be a valid string",
            400
        );
    }

    if (data.limit !== undefined) {
        if (
            typeof data.limit !== "number" ||
            !Number.isInteger(data.limit)
        ) {
            throw new AppError(
                "Limit must be an integer",
                400
            );
        }

        if (data.limit < 1 || data.limit > 100) {
            throw new AppError(
                "Limit must be between 1 and 100",
                400
            );
        }
    }

    if (
        data.categoryId !== undefined &&
        (
            typeof data.categoryId !== "string" ||
            !isValidUuid(data.categoryId)
        )
    ) {
        throw new AppError(
            "Category ID must be a valid UUID",
            400
        );
    }

    if (
        data.search !== undefined &&
        typeof data.search !== "string"
    ) {
        throw new AppError(
            "Search must be a valid string",
            400
        );
    }

    if (
        data.minPrice !== undefined &&
        (
            typeof data.minPrice !== "number" ||
            !Number.isFinite(data.minPrice) ||
            data.minPrice < 0
        )
    ) {
        throw new AppError(
            "Minimum price must be a non-negative number",
            400
        );
    }

    if (
        data.maxPrice !== undefined &&
        (
            typeof data.maxPrice !== "number" ||
            !Number.isFinite(data.maxPrice) ||
            data.maxPrice < 0
        )
    ) {
        throw new AppError(
            "Maximum price must be a non-negative number",
            400
        );
    }

    if (
        data.minPrice !== undefined &&
        data.maxPrice !== undefined &&
        data.minPrice > data.maxPrice
    ) {
        throw new AppError(
            "Minimum price cannot be greater than maximum price",
            400
        );
    }
};