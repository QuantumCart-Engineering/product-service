import {
    Request,
    Response
} from "express";

import {
    getHealth
} from "../../../controllers/health.controller";

describe("Health Controller", () => {
    it("should return healthy service response", () => {
        const req =
            {} as Request;

        const res =
            {} as Response;

        res.status =
            jest.fn().mockReturnValue(
                res
            );

        res.json =
            jest.fn().mockReturnValue(
                res
            );

        getHealth(
            req,
            res
        );

        expect(
            res.status
        ).toHaveBeenCalledWith(
            200
        );

        expect(
            res.json
        ).toHaveBeenCalledWith({
            success: true,
            message:
                "Product Service is healthy",
            data: {
                service:
                    "product-service",
                status: "UP"
            }
        });
    });
});