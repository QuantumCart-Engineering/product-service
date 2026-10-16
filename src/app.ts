import express, {
    Application,
    Request,
    Response,
    NextFunction
} from "express";

import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";

import healthRoutes from "./routes/health.routes";
import categoryRoutes from "./routes/category.routes";
import productRoutes from "./routes/product.routes";

import {
    swaggerSpec
} from "./config/swagger";

import {
    errorMiddleware
} from "./middlewares/error.middleware";

import {
    createOriginChecker,
    parseAllowedOrigins
} from "./middlewares/cors.middleware";

const app: Application = express();

/**
 * Security
 */
app.use(
    helmet()
);

/**
 * CORS
 *
 * Restrict origins through ALLOWED_ORIGINS.
 * Example:
 * ALLOWED_ORIGINS=http://localhost:3000,http://localhost:4200
 *
 * Disallowed origins are rejected by omitting the CORS headers (see
 * `createOriginChecker`) rather than by raising, so a browser origin can
 * never turn a normal request into a 500.
 */
app.use(
    cors({
        origin: createOriginChecker(
            parseAllowedOrigins(
                process.env.ALLOWED_ORIGINS
            ),
            process.env.NODE_ENV ?? "development"
        )
    })
);

/**
 * Logging
 *
 * Use production-friendly logging format in production.
 */
app.use(
    morgan(
        process.env.NODE_ENV === "production"
            ? "combined"
            : "dev"
    )
);

/**
 * Request parsing
 *
 * Explicit limits prevent unnecessarily large
 * request bodies from reaching application logic.
 */
app.use(
    express.json({
        limit: "1mb"
    })
);

app.use(
    express.urlencoded({
        extended: true,
        limit: "1mb"
    })
);

/**
 * Swagger
 */
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);

/**
 * Health
 */
app.use(
    "/",
    healthRoutes
);

/**
 * Category API
 */
app.use(
    "/api/v1/categories",
    categoryRoutes
);

/**
 * Product API
 */
app.use(
    "/api/v1/products",
    productRoutes
);

/**
 * 404 handler
 */
app.use(
    (
        _req: Request,
        res: Response
    ) => {
        res.status(404).json({
            success: false,
            message: "Route not found"
        });
    }
);

/**
 * Global error middleware
 */
app.use(
    (
        error: unknown,
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        errorMiddleware(
            error,
            req,
            res,
            next
        );
    }
);

export default app;