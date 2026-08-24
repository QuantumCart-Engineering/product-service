import { Request, Response } from "express";

export const getHealth = (
    _req: Request,
    res: Response
) => {
    res.status(200).json({
        success: true,
        message: "Product Service is healthy",
        data: {
            service: "product-service",
            status: "UP"
        }
    });
};