import {
    Request,
    Response
} from "express";

import {
    createProductService,
    getProductByIdService,
    getProductsService,
    updateProductService,
    deleteProductService
} from "../services/product.service";

import {
    validateCreateProduct
} from "../validators/product/create-product.validator";

import {
    validateUpdateProduct
} from "../validators/product/update-product.validator";

import {
    validateListProduct,
    ListProductQuery
} from "../validators/product/list-product.validator";

import {
    decodeCursor,
    encodeCursor
} from "../utils/cursor";

import {
    AppError
} from "../utils/app-error";

/**
 * Get a route parameter as a string.
 *
 * Express can type route parameters as
 * string | string[]. Our services require
 * a string, so we normalize it here.
 */
const getRouteParam = (
    value: string | string[] | undefined,
    paramName: string
): string => {
    if (
        typeof value !== "string" ||
        !value.trim()
    ) {
        throw new AppError(
            `${paramName} is required`,
            400
        );
    }

    return value;
};

/**
 * Create Product
 *
 * POST /api/v1/products
 */
export const createProductController =
    async (
        req: Request,
        res: Response
    ) => {
        validateCreateProduct(
            req.body
        );

        const product =
            await createProductService(
                req.body
            );

        return res.status(201).json({
            success: true,
            message:
                "Product created successfully",
            data: product
        });
    };

/**
 * Get Products
 *
 * GET /api/v1/products
 */
export const getProductsController =
    async (
        req: Request,
        res: Response
    ) => {
        /*
         * Express query parameters are strings
         * by default, so convert numeric values
         * before validation.
         */
        const query: ListProductQuery = {
            cursor:
                typeof req.query.cursor ===
                "string"
                    ? req.query.cursor
                    : undefined,

            limit:
                req.query.limit !==
                undefined
                    ? Number(
                          req.query.limit
                      )
                    : undefined,

            categoryId:
                typeof req.query.categoryId ===
                "string"
                    ? req.query.categoryId
                    : undefined,

            search:
                typeof req.query.search ===
                "string"
                    ? req.query.search
                    : undefined,

            minPrice:
                req.query.minPrice !==
                undefined
                    ? Number(
                          req.query.minPrice
                      )
                    : undefined,

            maxPrice:
                req.query.maxPrice !==
                undefined
                    ? Number(
                          req.query.maxPrice
                      )
                    : undefined
        };

        /*
         * Validator throws AppError if
         * query is invalid.
         */
        validateListProduct(
            query
        );

        let cursor:
            | {
                  createdAt: string;
                  id: string;
              }
            | undefined;

        if (query.cursor) {
            try {
                cursor =
                    decodeCursor(
                        query.cursor
                    );
            } catch {
                throw new AppError(
                    "Invalid cursor",
                    400
                );
            }
        }

        const result =
            await getProductsService({
                limit:
                    query.limit ??
                    20,

                cursor,

                categoryId:
                    query.categoryId,

                search:
                    query.search
            });

        let nextCursor:
            | string
            | null = null;

        if (
            result.hasMore &&
            result.products.length > 0
        ) {
            const lastProduct =
                result.products[
                    result.products.length - 1
                ];

            nextCursor =
                encodeCursor({
                    createdAt:
                        lastProduct.created_at.toISOString(),
                    id:
                        lastProduct.id
                });
        }

        return res.status(200).json({
            success: true,

            data:
                result.products,

            pagination: {
                limit:
                    query.limit ??
                    20,

                hasMore:
                    result.hasMore,

                nextCursor
            }
        });
    };

/**
 * Get Product By ID
 *
 * GET /api/v1/products/:id
 */
export const getProductByIdController =
    async (
        req: Request,
        res: Response
    ) => {
        const id =
            getRouteParam(
                req.params.id,
                "Product ID"
            );

        const product =
            await getProductByIdService(
                id
            );

        return res.status(200).json({
            success: true,
            data: product
        });
    };

/**
 * Update Product
 *
 * PUT /api/v1/products/:id
 */
export const updateProductController =
    async (
        req: Request,
        res: Response
    ) => {
        const id =
            getRouteParam(
                req.params.id,
                "Product ID"
            );

        validateUpdateProduct(
            req.body
        );

        const product =
            await updateProductService(
                id,
                req.body
            );

        return res.status(200).json({
            success: true,
            message:
                "Product updated successfully",
            data: product
        });
    };

/**
 * Delete Product
 *
 * DELETE /api/v1/products/:id
 */
export const deleteProductController =
    async (
        req: Request,
        res: Response
    ) => {
        const id =
            getRouteParam(
                req.params.id,
                "Product ID"
            );

        const result =
            await deleteProductService(
                id
            );

        return res.status(200).json({
            success: true,
            ...result
        });
    };