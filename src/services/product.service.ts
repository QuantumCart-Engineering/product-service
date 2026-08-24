import {
    CreateProductDto
} from "../dtos/product/create-product.dto";

import {
    UpdateProductDto
} from "../dtos/product/update-product.dto";

import {
    AppError
} from "../utils/app-error";

import {
    createProductRepository,
    deleteProductRepository,
    findProductByIdRepository,
    findProductBySkuRepository,
    findProductBySlugRepository,
    getActiveProductsByCursorRepository,
    getActiveProductsRepository,
    getProductsByCategoryAndCursorRepository,
    getProductsByCategoryRepository,
    searchProductsByCursorRepository,
    searchProductsRepository,
    updateProductRepository,
    ProductCursor,
    ProductRecord
} from "../repositories/product.repository";

import {
    findCategoryById
} from "../repositories/category.repository";

/**
 * Create Product
 */
export const createProductService =
    async (
        data: CreateProductDto
    ) => {
        const sku =
            data.sku.trim();

        /*
         * Check duplicate SKU
         */
        const existingSku =
            await findProductBySkuRepository(
                sku
            );

        if (existingSku) {
            throw new AppError(
                "Product with this SKU already exists",
                409
            );
        }

        /*
         * Generate slug from product name
         */
        const slug =
            data.name
                .trim()
                .toLowerCase()
                .replace(
                    /[^a-z0-9]+/g,
                    "-"
                )
                .replace(
                    /^-+|-+$/g,
                    ""
                );

        /*
         * Check duplicate slug
         */
        const existingSlug =
            await findProductBySlugRepository(
                slug
            );

        if (existingSlug) {
            throw new AppError(
                "Product with this name already exists",
                409
            );
        }

        /*
         * Validate all categories
         */
        for (
            const categoryId of data.categoryIds
        ) {
            const categoryRows =
                await findCategoryById(
                    categoryId
                );

            const category =
                categoryRows[0];

            if (!category) {
                throw new AppError(
                    `Category ${categoryId} does not exist`,
                    404
                );
            }

            if (
                category.status !==
                "ACTIVE"
            ) {
                throw new AppError(
                    `Category ${categoryId} is inactive`,
                    400
                );
            }
        }

        return createProductRepository(
            data,
            slug
        );
    };

/**
 * Get Product By ID
 */
export const getProductByIdService =
    async (
        id: string
    ) => {
        const product =
            await findProductByIdRepository(
                id
            );

        if (!product) {
            throw new AppError(
                "Product not found",
                404
            );
        }

        return product;
    };

/**
 * Get Products
 *
 * Supports:
 * - normal listing
 * - cursor pagination
 * - category filtering
 * - search
 */
export const getProductsService =
    async (
        options: {
            limit: number;
            cursor?: ProductCursor;
            categoryId?: string;
            search?: string;
        }
    ) => {
        const {
            limit,
            cursor,
            categoryId,
            search
        } = options;

        /*
         * Validate category if provided
         */
        if (categoryId) {
            const categoryRows =
                await findCategoryById(
                    categoryId
                );

            const category =
                categoryRows[0];

            if (!category) {
                throw new AppError(
                    "Category not found",
                    404
                );
            }

            if (
                category.status !==
                "ACTIVE"
            ) {
                throw new AppError(
                    "Category is inactive",
                    400
                );
            }
        }

        /*
         * Search + Cursor
         */
        if (
            search &&
            cursor
        ) {
            const products =
                await searchProductsByCursorRepository(
                    search.trim(),
                    cursor,
                    limit
                );

            return {
                products,
                hasMore:
                    products.length ===
                    limit
            };
        }

        /*
         * Search without Cursor
         */
        if (search) {
            const products =
                await searchProductsRepository(
                    search.trim(),
                    limit
                );

            return {
                products,
                hasMore:
                    products.length ===
                    limit
            };
        }

        /*
         * Category + Cursor
         */
        if (
            categoryId &&
            cursor
        ) {
            const products =
                await getProductsByCategoryAndCursorRepository(
                    categoryId,
                    cursor,
                    limit
                );

            return {
                products,
                hasMore:
                    products.length ===
                    limit
            };
        }

        /*
         * Category without Cursor
         */
        if (categoryId) {
            const products =
                await getProductsByCategoryRepository(
                    categoryId,
                    limit
                );

            return {
                products,
                hasMore:
                    products.length ===
                    limit
            };
        }

        /*
         * Cursor pagination
         */
        if (cursor) {
            const products =
                await getActiveProductsByCursorRepository(
                    cursor,
                    limit
                );

            return {
                products,
                hasMore:
                    products.length ===
                    limit
            };
        }

        /*
         * Normal listing
         */
        const products =
            await getActiveProductsRepository(
                limit
            );

        return {
            products,
            hasMore:
                products.length ===
                limit
        };
    };

/**
 * Update Product
 */
export const updateProductService =
    async (
        id: string,
        data: UpdateProductDto
    ) => {
        const existingProduct =
            await findProductByIdRepository(
                id
            );

        if (!existingProduct) {
            throw new AppError(
                "Product not found",
                404
            );
        }

        if (
            existingProduct.status !==
            "ACTIVE"
        ) {
            throw new AppError(
                "Product is inactive",
                400
            );
        }

        /*
         * Check duplicate SKU
         */
        if (data.sku) {
            const existingSku =
                await findProductBySkuRepository(
                    data.sku.trim()
                );

            if (
                existingSku &&
                existingSku.id !== id
            ) {
                throw new AppError(
                    "Product with this SKU already exists",
                    409
                );
            }
        }

        /*
         * Generate and validate new slug
         * when product name changes.
         */
        if (data.name) {
            const newSlug =
                data.name
                    .trim()
                    .toLowerCase()
                    .replace(
                        /[^a-z0-9]+/g,
                        "-"
                    )
                    .replace(
                        /^-+|-+$/g,
                        ""
                    );

            const existingSlug =
                await findProductBySlugRepository(
                    newSlug
                );

            if (
                existingSlug &&
                existingSlug.id !== id
            ) {
                throw new AppError(
                    "Product with this name already exists",
                    409
                );
            }

            data = {
                ...data,
                slug: newSlug
            };
        }

        /*
         * Validate updated categories
         */
        if (
            data.categoryIds !==
            undefined
        ) {
            for (
                const categoryId of data.categoryIds
            ) {
                const categoryRows =
                    await findCategoryById(
                        categoryId
                    );

                const category =
                    categoryRows[0];

                if (!category) {
                    throw new AppError(
                        `Category ${categoryId} does not exist`,
                        404
                    );
                }

                if (
                    category.status !==
                    "ACTIVE"
                ) {
                    throw new AppError(
                        `Category ${categoryId} is inactive`,
                        400
                    );
                }
            }
        }

        /*
         * Convert ProductWithCategories
         * into the plain ProductRecord expected
         * by the repository.
         */
        const existingProductRecord:
            ProductRecord = {
                id:
                    existingProduct.id,

                name:
                    existingProduct.name,

                slug:
                    existingProduct.slug,

                description:
                    existingProduct.description,

                price:
                    existingProduct.price,

                sku:
                    existingProduct.sku,

                stock_quantity:
                    existingProduct.stock_quantity,

                status:
                    existingProduct.status,

                created_at:
                    existingProduct.created_at,

                updated_at:
                    existingProduct.updated_at
            };

        return updateProductRepository(
            id,
            data,
            existingProductRecord
        );
    };

/**
 * Delete Product
 *
 * Uses soft delete.
 */
export const deleteProductService =
    async (
        id: string
    ) => {
        const product =
            await findProductByIdRepository(
                id
            );

        if (!product) {
            throw new AppError(
                "Product not found",
                404
            );
        }

        if (
            product.status !==
            "ACTIVE"
        ) {
            throw new AppError(
                "Product is already inactive",
                400
            );
        }

        await deleteProductRepository(
            id
        );

        return {
            message:
                "Product deleted successfully"
        };
    };