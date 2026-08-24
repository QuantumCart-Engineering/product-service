import { Router } from "express";

import {
    getHealth
} from "../controllers/health.controller";

const router = Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Check service health
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 */
router.get(
    "/health",
    getHealth
);

export default router;