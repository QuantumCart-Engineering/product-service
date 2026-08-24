import {
    ResultSetHeader,
    RowDataPacket
} from "mysql2";

import {
    randomUUID
} from "crypto";

import pool from "../config/database";

import {
    createProductQuery,
    findProductByIdQuery,
    findProductBySkuQuery,
    findProductBySlugQuery,
    updateProductQuery,
    deleteProductQuery,
    findActiveProductsQuery,
    findActiveProductsByCursorQuery,
    findProductsByCategoryQuery,
    findProductsByCategoryAndCursorQuery,
    searchProductsQuery,
    searchProductsByCursorQuery,
    createProductCategoryQuery,
    findProductCategoriesQuery,
    deleteProductCategoriesQuery
} from "../queries/product.queries";

import {
    CreateProductDto
} from "../dtos/product/create-product.dto";

import {
    UpdateProductDto
} from "../dtos/product/update-product.dto";

/**
 * Plain application-level product type.
 *
 * This type is intentionally independent of
 * mysql2's RowDataPacket.
 */
export interface ProductRecord {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    price: number;
    sku: string;
    stock_quantity: number;
    status: "ACTIVE" | "INACTIVE";
    created_at: Date;
    updated_at: Date;
}

/**
 * Database result type.
 *
 * RowDataPacket is required here because this
 * represents rows returned directly by mysql2.
 */
export interface ProductRow
    extends RowDataPacket,
        ProductRecord {}

/**
 * Product-category database result.
 */
export interface ProductCategoryRow
    extends RowDataPacket {
    category_id: string;
}

export interface ProductWithCategories
    extends ProductRecord {
    categoryIds: string[];
}

export interface ProductCursor {
    createdAt: string;
    id: string;
}

/**
 * Create Product
 *
 * Product creation and category mapping are handled
 * inside one transaction.
 */
export const createProductRepository =
    async (
        data: CreateProductDto,
        slug: string
    ): Promise<ProductWithCategories> => {
        const connection =
            await pool.getConnection();

        try {
            await connection.beginTransaction();

            await connection.execute(
                createProductQuery,
                [
                    randomUUID(),
                    data.name.trim(),
                    slug,
                    data.description?.trim() ?? null,
                    data.price,
                    data.sku.trim(),
                    data.stockQuantity
                ]
            );

            const [productRows] =
                await connection.execute<
                    ProductRow[]
                >(
                    findProductBySkuQuery,
                    [data.sku.trim()]
                );

            if (productRows.length === 0) {
                throw new Error(
                    "Product was created but could not be retrieved"
                );
            }

            const product =
                productRows[0];

            for (
                const categoryId of data.categoryIds
            ) {
                await connection.execute(
                    createProductCategoryQuery,
                    [
                        product.id,
                        categoryId
                    ]
                );
            }

            await connection.commit();

            return {
                id: product.id,
                name: product.name,
                slug: product.slug,
                description: product.description,
                price: product.price,
                sku: product.sku,
                stock_quantity:
                    product.stock_quantity,
                status: product.status,
                created_at:
                    product.created_at,
                updated_at:
                    product.updated_at,
                categoryIds:
                    data.categoryIds
            };
        } catch (error) {
            await connection.rollback();

            throw error;
        } finally {
            connection.release();
        }
    };

/**
 * Find Product By ID
 */
export const findProductByIdRepository =
    async (
        id: string
    ): Promise<ProductWithCategories | null> => {
        const [rows] =
            await pool.query<
                ProductRow[]
            >(
                findProductByIdQuery,
                [id]
            );

        if (rows.length === 0) {
            return null;
        }

        const [categoryRows] =
            await pool.query<
                ProductCategoryRow[]
            >(
                findProductCategoriesQuery,
                [id]
            );

        const product =
            rows[0];

        return {
            id: product.id,
            name: product.name,
            slug: product.slug,
            description:
                product.description,
            price: product.price,
            sku: product.sku,
            stock_quantity:
                product.stock_quantity,
            status: product.status,
            created_at:
                product.created_at,
            updated_at:
                product.updated_at,
            categoryIds:
                categoryRows.map(
                    (row) =>
                        row.category_id
                )
        };
    };

/**
 * Find Product By SKU
 */
export const findProductBySkuRepository =
    async (
        sku: string
    ): Promise<ProductRecord | null> => {
        const [rows] =
            await pool.query<
                ProductRow[]
            >(
                findProductBySkuQuery,
                [sku]
            );

        if (rows.length === 0) {
            return null;
        }

        const product =
            rows[0];

        return {
            id: product.id,
            name: product.name,
            slug: product.slug,
            description:
                product.description,
            price: product.price,
            sku: product.sku,
            stock_quantity:
                product.stock_quantity,
            status: product.status,
            created_at:
                product.created_at,
            updated_at:
                product.updated_at
        };
    };

/**
 * Find Product By Slug
 */
export const findProductBySlugRepository =
    async (
        slug: string
    ): Promise<ProductRecord | null> => {
        const [rows] =
            await pool.query<
                ProductRow[]
            >(
                findProductBySlugQuery,
                [slug]
            );

        if (rows.length === 0) {
            return null;
        }

        const product =
            rows[0];

        return {
            id: product.id,
            name: product.name,
            slug: product.slug,
            description:
                product.description,
            price: product.price,
            sku: product.sku,
            stock_quantity:
                product.stock_quantity,
            status: product.status,
            created_at:
                product.created_at,
            updated_at:
                product.updated_at
        };
    };

/**
 * Update Product
 *
 * If categoryIds are provided, existing mappings
 * are replaced inside the same transaction.
 */
export const updateProductRepository =
    async (
        id: string,
        data: UpdateProductDto,
        existingProduct: ProductRecord
    ): Promise<ProductWithCategories> => {
        const connection =
            await pool.getConnection();

        try {
            await connection.beginTransaction();

            const name =
                data.name !== undefined
                    ? data.name.trim()
                    : existingProduct.name;

            const slug =
                data.slug !== undefined
                    ? data.slug.trim()
                    : existingProduct.slug;

            const description =
                data.description !== undefined
                    ? data.description.trim()
                    : existingProduct.description;

            const price =
                data.price !== undefined
                    ? data.price
                    : existingProduct.price;

            const sku =
                data.sku !== undefined
                    ? data.sku.trim()
                    : existingProduct.sku;

            const stockQuantity =
                data.stockQuantity !== undefined
                    ? data.stockQuantity
                    : existingProduct.stock_quantity;

            await connection.execute(
                updateProductQuery,
                [
                    name,
                    slug,
                    description,
                    price,
                    sku,
                    stockQuantity,
                    id
                ]
            );

            if (
                data.categoryIds !==
                undefined
            ) {
                await connection.execute(
                    deleteProductCategoriesQuery,
                    [id]
                );

                for (
                    const categoryId of data.categoryIds
                ) {
                    await connection.execute(
                        createProductCategoryQuery,
                        [
                            id,
                            categoryId
                        ]
                    );
                }
            }

            const [productRows] =
                await connection.execute<
                    ProductRow[]
                >(
                    findProductByIdQuery,
                    [id]
                );

            if (productRows.length === 0) {
                throw new Error(
                    "Product could not be retrieved after update"
                );
            }

            const [categoryRows] =
                await connection.query<
                    ProductCategoryRow[]
                >(
                    findProductCategoriesQuery,
                    [id]
                );

            await connection.commit();

            const product =
                productRows[0];

            return {
                id: product.id,
                name: product.name,
                slug: product.slug,
                description:
                    product.description,
                price: product.price,
                sku: product.sku,
                stock_quantity:
                    product.stock_quantity,
                status: product.status,
                created_at:
                    product.created_at,
                updated_at:
                    product.updated_at,
                categoryIds:
                    categoryRows.map(
                        (row) =>
                            row.category_id
                    )
            };
        } catch (error) {
            await connection.rollback();

            throw error;
        } finally {
            connection.release();
        }
    };

/**
 * Soft Delete Product
 */
export const deleteProductRepository =
    async (
        id: string
    ): Promise<void> => {
        await pool.execute<
            ResultSetHeader
        >(
            deleteProductQuery,
            [id]
        );
    };

/**
 * Get Product Categories
 */
export const getProductCategoriesRepository =
    async (
        productId: string
    ): Promise<string[]> => {
        const [rows] =
            await pool.query<
                ProductCategoryRow[]
            >(
                findProductCategoriesQuery,
                [productId]
            );

        return rows.map(
            (row) =>
                row.category_id
        );
    };

/**
 * Get Active Products
 */
export const getActiveProductsRepository =
    async (
        limit: number
    ): Promise<ProductRecord[]> => {
        const [rows] =
            await pool.query<
                ProductRow[]
            >(
                findActiveProductsQuery,
                [limit]
            );

        return rows.map(
            (product) => ({
                id: product.id,
                name: product.name,
                slug: product.slug,
                description:
                    product.description,
                price: product.price,
                sku: product.sku,
                stock_quantity:
                    product.stock_quantity,
                status: product.status,
                created_at:
                    product.created_at,
                updated_at:
                    product.updated_at
            })
        );
    };

/**
 * Get Active Products By Cursor
 */
export const getActiveProductsByCursorRepository =
    async (
        cursor: ProductCursor,
        limit: number
    ): Promise<ProductRecord[]> => {
        const [rows] =
            await pool.query<
                ProductRow[]
            >(
                findActiveProductsByCursorQuery,
                [
                    cursor.createdAt,
                    cursor.createdAt,
                    cursor.id,
                    limit
                ]
            );

        return rows.map(
            (product) => ({
                id: product.id,
                name: product.name,
                slug: product.slug,
                description:
                    product.description,
                price: product.price,
                sku: product.sku,
                stock_quantity:
                    product.stock_quantity,
                status: product.status,
                created_at:
                    product.created_at,
                updated_at:
                    product.updated_at
            })
        );
    };

/**
 * Get Products By Category
 */
export const getProductsByCategoryRepository =
    async (
        categoryId: string,
        limit: number
    ): Promise<ProductRecord[]> => {
        const [rows] =
            await pool.query<
                ProductRow[]
            >(
                findProductsByCategoryQuery,
                [
                    categoryId,
                    limit
                ]
            );

        return rows.map(
            (product) => ({
                id: product.id,
                name: product.name,
                slug: product.slug,
                description:
                    product.description,
                price: product.price,
                sku: product.sku,
                stock_quantity:
                    product.stock_quantity,
                status: product.status,
                created_at:
                    product.created_at,
                updated_at:
                    product.updated_at
            })
        );
    };

/**
 * Get Products By Category And Cursor
 */
export const getProductsByCategoryAndCursorRepository =
    async (
        categoryId: string,
        cursor: ProductCursor,
        limit: number
    ): Promise<ProductRecord[]> => {
        const [rows] =
            await pool.query<
                ProductRow[]
            >(
                findProductsByCategoryAndCursorQuery,
                [
                    categoryId,
                    cursor.createdAt,
                    cursor.createdAt,
                    cursor.id,
                    limit
                ]
            );

        return rows.map(
            (product) => ({
                id: product.id,
                name: product.name,
                slug: product.slug,
                description:
                    product.description,
                price: product.price,
                sku: product.sku,
                stock_quantity:
                    product.stock_quantity,
                status: product.status,
                created_at:
                    product.created_at,
                updated_at:
                    product.updated_at
            })
        );
    };

/**
 * Search Products
 */
export const searchProductsRepository =
    async (
        search: string,
        limit: number
    ): Promise<ProductRecord[]> => {
        const searchPattern =
            `%${search}%`;

        const [rows] =
            await pool.query<
                ProductRow[]
            >(
                searchProductsQuery,
                [
                    searchPattern,
                    searchPattern,
                    searchPattern,
                    limit
                ]
            );

        return rows.map(
            (product) => ({
                id: product.id,
                name: product.name,
                slug: product.slug,
                description:
                    product.description,
                price: product.price,
                sku: product.sku,
                stock_quantity:
                    product.stock_quantity,
                status: product.status,
                created_at:
                    product.created_at,
                updated_at:
                    product.updated_at
            })
        );
    };

/**
 * Search Products By Cursor
 */
export const searchProductsByCursorRepository =
    async (
        search: string,
        cursor: ProductCursor,
        limit: number
    ): Promise<ProductRecord[]> => {
        const searchPattern =
            `%${search}%`;

        const [rows] =
            await pool.query<
                ProductRow[]
            >(
                searchProductsByCursorQuery,
                [
                    searchPattern,
                    searchPattern,
                    searchPattern,
                    cursor.createdAt,
                    cursor.createdAt,
                    cursor.id,
                    limit
                ]
            );

        return rows.map(
            (product) => ({
                id: product.id,
                name: product.name,
                slug: product.slug,
                description:
                    product.description,
                price: product.price,
                sku: product.sku,
                stock_quantity:
                    product.stock_quantity,
                status: product.status,
                created_at:
                    product.created_at,
                updated_at:
                    product.updated_at
            })
        );
    };
