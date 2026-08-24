import {
    Request,
    Response,
    NextFunction
} from "express";

import {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
} from "../../../controllers/category.controller";

import {
    createCategoryService,
    getCategoriesService,
    getCategoryByIdService,
    updateCategoryService,
    deleteCategoryService
} from "../../../services/category.service";

jest.mock(
    "../../../services/category.service",
    () => ({
        createCategoryService: jest.fn(),
        getCategoriesService: jest.fn(),
        getCategoryByIdService: jest.fn(),
        updateCategoryService: jest.fn(),
        deleteCategoryService: jest.fn()
    })
);

const mockedCreateCategoryService =
    createCategoryService as jest.Mock;

const mockedGetCategoriesService =
    getCategoriesService as jest.Mock;

const mockedGetCategoryByIdService =
    getCategoryByIdService as jest.Mock;

const mockedUpdateCategoryService =
    updateCategoryService as jest.Mock;

const mockedDeleteCategoryService =
    deleteCategoryService as jest.Mock;

const createMockResponse = () => {
    const response = {
        status: jest.fn(),
        json: jest.fn()
    } as unknown as Response;

    (
        response.status as jest.Mock
    ).mockReturnValue(response);

    return response;
};

const createMockNext = () =>
    jest.fn() as unknown as NextFunction;

describe("Category Controller", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("createCategory", () => {
        it("should create category and return 201", async () => {
            const category = {
                id: "category-id",
                name: "Electronics",
                slug: "electronics",
                description: null,
                parentId: null
            };

            mockedCreateCategoryService.mockResolvedValue(
                category
            );

            const req = {
                body: {
                    name: "Electronics"
                }
            } as Request;

            const res =
                createMockResponse();

            const next =
                createMockNext();

            await createCategory(
                req,
                res,
                next
            );

            expect(
                mockedCreateCategoryService
            ).toHaveBeenCalledWith(
                req.body
            );

            expect(
                res.status
            ).toHaveBeenCalledWith(
                201
            );

            expect(
                res.json
            ).toHaveBeenCalledWith({
                success: true,
                message:
                    "Category created successfully",
                data: category
            });

            expect(next).not.toHaveBeenCalled();
        });

        it("should pass service error to next", async () => {
            const error =
                new Error(
                    "Something went wrong"
                );

            mockedCreateCategoryService.mockRejectedValue(
                error
            );

            const req = {
                body: {
                    name: "Electronics"
                }
            } as Request;

            const res =
                createMockResponse();

            const next =
                createMockNext();

            await createCategory(
                req,
                res,
                next
            );

            expect(next).toHaveBeenCalledWith(
                error
            );

            expect(
                res.status
            ).not.toHaveBeenCalled();
        });
    });

    describe("getCategories", () => {
        it("should return categories with 200", async () => {
            const categories = [
                {
                    id: "category-1",
                    name: "Electronics",
                    slug: "electronics",
                    parentId: null
                }
            ];

            mockedGetCategoriesService.mockResolvedValue(
                categories
            );

            const req =
                {} as Request;

            const res =
                createMockResponse();

            const next =
                createMockNext();

            await getCategories(
                req,
                res,
                next
            );

            expect(
                mockedGetCategoriesService
            ).toHaveBeenCalledTimes(1);

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
                    "Categories fetched successfully",
                data: categories
            });

            expect(next).not.toHaveBeenCalled();
        });

        it("should pass service error to next", async () => {
            const error =
                new Error(
                    "Failed to fetch categories"
                );

            mockedGetCategoriesService.mockRejectedValue(
                error
            );

            const req =
                {} as Request;

            const res =
                createMockResponse();

            const next =
                createMockNext();

            await getCategories(
                req,
                res,
                next
            );

            expect(next).toHaveBeenCalledWith(
                error
            );
        });
    });

    describe("getCategoryById", () => {
        it("should return category with 200", async () => {
            const category = {
                id: "category-id",
                name: "Electronics",
                slug: "electronics",
                description: null,
                parentId: null,
                status: "ACTIVE"
            };

            mockedGetCategoryByIdService.mockResolvedValue(
                category
            );

            const req = {
                params: {
                    id: "category-id"
                }
            } as Request<{
                id: string;
            }>;

            const res =
                createMockResponse();

            const next =
                createMockNext();

            await getCategoryById(
                req,
                res,
                next
            );

            expect(
                mockedGetCategoryByIdService
            ).toHaveBeenCalledWith(
                "category-id"
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
                    "Category fetched successfully",
                data: category
            });

            expect(next).not.toHaveBeenCalled();
        });

        it("should pass service error to next", async () => {
            const error =
                new Error(
                    "Category not found"
                );

            mockedGetCategoryByIdService.mockRejectedValue(
                error
            );

            const req = {
                params: {
                    id: "invalid-id"
                }
            } as Request<{
                id: string;
            }>;

            const res =
                createMockResponse();

            const next =
                createMockNext();

            await getCategoryById(
                req,
                res,
                next
            );

            expect(next).toHaveBeenCalledWith(
                error
            );
        });
    });

    describe("updateCategory", () => {
        it("should update category and return 200", async () => {
            const category = {
                id: "category-id",
                name: "Consumer Electronics",
                slug: "consumer-electronics",
                description:
                    "Updated description",
                parentId: null
            };

            const body = {
                name: "Consumer Electronics",
                description:
                    "Updated description"
            };

            mockedUpdateCategoryService.mockResolvedValue(
                category
            );

            const req = {
                params: {
                    id: "category-id"
                },
                body
            } as Request<{
                id: string;
            }>;

            const res =
                createMockResponse();

            const next =
                createMockNext();

            await updateCategory(
                req,
                res,
                next
            );

            expect(
                mockedUpdateCategoryService
            ).toHaveBeenCalledWith(
                "category-id",
                body
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
                    "Category updated successfully",
                data: category
            });

            expect(next).not.toHaveBeenCalled();
        });

        it("should pass service error to next", async () => {
            const error =
                new Error(
                    "Category not found"
                );

            mockedUpdateCategoryService.mockRejectedValue(
                error
            );

            const req = {
                params: {
                    id: "category-id"
                },
                body: {
                    name: "Electronics"
                }
            } as Request<{
                id: string;
            }>;

            const res =
                createMockResponse();

            const next =
                createMockNext();

            await updateCategory(
                req,
                res,
                next
            );

            expect(next).toHaveBeenCalledWith(
                error
            );
        });
    });

    describe("deleteCategory", () => {
        it("should delete category and return 200", async () => {
            mockedDeleteCategoryService.mockResolvedValue(
                {
                    id: "category-id"
                }
            );

            const req = {
                params: {
                    id: "category-id"
                }
            } as Request<{
                id: string;
            }>;

            const res =
                createMockResponse();

            const next =
                createMockNext();

            await deleteCategory(
                req,
                res,
                next
            );

            expect(
                mockedDeleteCategoryService
            ).toHaveBeenCalledWith(
                "category-id"
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
                    "Category deleted successfully"
            });

            expect(next).not.toHaveBeenCalled();
        });

        it("should pass service error to next", async () => {
            const error =
                new Error(
                    "Category not found"
                );

            mockedDeleteCategoryService.mockRejectedValue(
                error
            );

            const req = {
                params: {
                    id: "category-id"
                }
            } as Request<{
                id: string;
            }>;

            const res =
                createMockResponse();

            const next =
                createMockNext();

            await deleteCategory(
                req,
                res,
                next
            );

            expect(next).toHaveBeenCalledWith(
                error
            );
        });
    });
});