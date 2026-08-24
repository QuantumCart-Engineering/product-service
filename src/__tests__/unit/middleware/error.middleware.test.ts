import {
    Request,
    Response,
    NextFunction
} from "express";

import {
    errorMiddleware
} from "../../../middlewares/error.middleware";

import {
    AppError
} from "../../../utils/app-error";

describe("Error Middleware", () => {
    const createMockResponse = () => {
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

        return res;
    };

    const req =
        {} as Request;

    const next =
        jest.fn() as unknown as NextFunction;

    beforeEach(() => {
        jest.clearAllMocks();
        jest
            .spyOn(console, "error")
            .mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("should handle AppError with its status code and message", () => {
        const res =
            createMockResponse();

        const error =
            new AppError(
                "Category not found",
                404
            );

        errorMiddleware(
            error,
            req,
            res,
            next
        );

        expect(
            res.status
        ).toHaveBeenCalledWith(
            404
        );

        expect(
            res.json
        ).toHaveBeenCalledWith({
            success: false,
            message:
                "Category not found"
        });

        expect(
            console.error
        ).not.toHaveBeenCalled();
    });

    it("should handle unknown errors with 500 status", () => {
        const res =
            createMockResponse();

        const error =
            new Error(
                "Unexpected database error"
            );

        errorMiddleware(
            error,
            req,
            res,
            next
        );

        expect(
            console.error
        ).toHaveBeenCalledWith(
            error
        );

        expect(
            res.status
        ).toHaveBeenCalledWith(
            500
        );

        expect(
            res.json
        ).toHaveBeenCalledWith({
            success: false,
            message:
                "Internal server error"
        });
    });

    it("should handle non-Error unknown values with 500 status", () => {
        const res =
            createMockResponse();

        const error =
            "Unexpected error";

        errorMiddleware(
            error,
            req,
            res,
            next
        );

        expect(
            console.error
        ).toHaveBeenCalledWith(
            error
        );

        expect(
            res.status
        ).toHaveBeenCalledWith(
            500
        );

        expect(
            res.json
        ).toHaveBeenCalledWith({
            success: false,
            message:
                "Internal server error"
        });
    });
});