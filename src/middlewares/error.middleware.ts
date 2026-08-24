import {
    Request,
    Response,
    NextFunction
} from "express";

import { AppError } from "../utils/app-error";

export const errorMiddleware = (
    error: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    if (error instanceof AppError) {
        res.status(
            error.statusCode
        ).json({
            success: false,
            message: error.message
        });

        return;
    }

    console.error(error);

    res.status(500).json({
        success: false,
        message: "Internal server error"
    });
};