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
 */
const allowedOrigins =
    process.env.ALLOWED_ORIGINS
        ?.split(",")
        .map((origin) => origin.trim())
        .filter(Boolean) ?? [];

app.use(
    cors({
        origin: (
            origin,
            callback
        ) => {
            // Allow non-browser requests such as curl/postman.
            if (!origin) {
                callback(null, true);
                return;
            }

            // Development fallback.
            if (
                allowedOrigins.length === 0 &&
                process.env.NODE_ENV !== "production"
            ) {
                callback(null, true);
                return;
            }

            if (
                allowedOrigins.includes(origin)
            ) {
                callback(null, true);
                return;
            }

            callback(
                new Error(
                    "Origin not allowed by CORS"
                )
            );
        }
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