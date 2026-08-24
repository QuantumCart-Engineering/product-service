import {
    Request,
    Response,
    NextFunction
} from "express";

import {
    createCategoryService,
    getCategoryByIdService,
    getCategoriesService,
    updateCategoryService,
    deleteCategoryService
} from "../services/category.service";

interface CategoryIdParams {
    id: string;
}

export const createCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const category =
            await createCategoryService(
                req.body
            );

        res.status(201).json({
            success: true,
            message:
                "Category created successfully",
            data: category
        });
    } catch (error) {
        next(error);
    }
};

export const getCategories = async (
    _req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const categories =
            await getCategoriesService();

        res.status(200).json({
            success: true,
            message:
                "Categories fetched successfully",
            data: categories
        });
    } catch (error) {
        next(error);
    }
};

export const getCategoryById = async (
    req: Request<CategoryIdParams>,
    res: Response,
    next: NextFunction
) => {
    try {
        const category =
            await getCategoryByIdService(
                req.params.id
            );

        res.status(200).json({
            success: true,
            message:
                "Category fetched successfully",
            data: category
        });
    } catch (error) {
        next(error);
    }
};

export const updateCategory = async (
    req: Request<CategoryIdParams>,
    res: Response,
    next: NextFunction
) => {
    try {
        const category =
            await updateCategoryService(
                req.params.id,
                req.body
            );

        res.status(200).json({
            success: true,
            message:
                "Category updated successfully",
            data: category
        });
    } catch (error) {
        next(error);
    }
};

export const deleteCategory = async (
    req: Request<CategoryIdParams>,
    res: Response,
    next: NextFunction
) => {
    try {
        await deleteCategoryService(
            req.params.id
        );

        res.status(200).json({
            success: true,
            message:
                "Category deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};