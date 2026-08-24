import { Router } from "express";

import {
    createProductController,
    getProductsController,
    getProductByIdController,
    updateProductController,
    deleteProductController
} from "../controllers/product.controller";

const router = Router();

/**
 * @swagger
 * /api/v1/products:
 *   post:
 *     summary: Create a product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProductRequest'
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Category not found
 *       409:
 *         description: SKU or product name already exists
 */
router.post("/", createProductController);

/**
 * @swagger
 * /api/v1/products:
 *   get:
 *     summary: Get active products
 *     description: Supports cursor pagination, category filtering and text search.
 *     tags: [Products]
 *     parameters:
 *       - name: cursor
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *         description: Cursor returned by the previous response.
 *       - name: limit
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *       - name: categoryId
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           format: uuid
 *       - name: search
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *         description: Searches product name, SKU and description.
 *     responses:
 *       200:
 *         description: Products fetched successfully
 *       400:
 *         description: Invalid query parameters
 *       404:
 *         description: Category not found
 */
router.get("/", getProductsController);

/**
 * @swagger
 * /api/v1/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Product fetched successfully
 *       404:
 *         description: Product not found
 */
router.get("/:id", getProductByIdController);

/**
 * @swagger
 * /api/v1/products/{id}:
 *   put:
 *     summary: Update a product
 *     tags: [Products]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProductRequest'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Validation error or inactive category/product
 *       404:
 *         description: Product or category not found
 *       409:
 *         description: SKU or product name already exists
 */
router.put("/:id", updateProductController);

/**
 * @swagger
 * /api/v1/products/{id}:
 *   delete:
 *     summary: Soft delete a product
 *     tags: [Products]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       400:
 *         description: Product is already inactive
 *       404:
 *         description: Product not found
 */
router.delete("/:id", deleteProductController);

export default router;