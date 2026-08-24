import { randomUUID } from "crypto";

import {
    CreateCategoryDto
} from "../dtos/category/create-category.dto";

import {
    UpdateCategoryDto
} from "../dtos/category/update-category.dto";

import {
    validateCreateCategory
} from "../validators/category/create-category.validator";

import {
    validateUpdateCategory
} from "../validators/category/update-category.validator";

import {
    createCategory,
    findCategoryById,
    findCategoryByName,
    findCategoryBySlug,
    findActiveCategories,
    updateCategory,
    deleteCategory
} from "../repositories/category.repository";

import { AppError } from "../utils/app-error";

const generateSlug = (
    value: string
): string => {
    return value
        .trim()
        .toLowerCase()
        .replace(
            /[^a-z0-9]+/g,
            "-"
        )
        .replace(
            /^-+|-+$/g,
            "");
};

const validateParentCategory = async (
    parentId: string,
    categoryId?: string
): Promise<void> => {
    const parents =
        await findCategoryById(
            parentId
        );

    if (parents.length === 0) {
        throw new AppError(
            "Parent category not found",
            404
        );
    }

    const parent = parents[0];

    if (parent.status !== "ACTIVE") {
        throw new AppError(
            "Parent category is not active",
            400
        );
    }

    if (
        categoryId &&
        parentId === categoryId
    ) {
        throw new AppError(
            "Category cannot be its own parent",
            400
        );
    }
};

const validateNoCircularReference =
    async (
        categoryId: string,
        parentId: string
    ): Promise<void> => {
        let currentParentId:
            | string
            | null = parentId;

        const visited = new Set<string>();

        while (currentParentId) {
            if (
                visited.has(
                    currentParentId
                )
            ) {
                throw new AppError(
                    "Circular category hierarchy detected",
                    400
                );
            }

            visited.add(
                currentParentId
            );

            if (
                currentParentId ===
                categoryId
            ) {
                throw new AppError(
                    "Circular category hierarchy is not allowed",
                    400
                );
            }

            const parents =
                await findCategoryById(
                    currentParentId
                );

            if (
                parents.length === 0
            ) {
                break;
            }

            currentParentId =
                parents[0].parent_id;
        }
    };

export const createCategoryService =
    async (
        data: CreateCategoryDto
    ) => {
        // 1. Validate request
        const validationErrors =
            validateCreateCategory(data);

        if (
            validationErrors.length > 0
        ) {
            throw new AppError(
                validationErrors.join(", "),
                400
            );
        }

        // 2. Normalize input
        const name =
            data.name.trim();

        const description =
            data.description !== undefined
                ? data.description.trim()
                : null;

        const parentId =
            data.parentId
                ? data.parentId.trim()
                : null;

        // 3. Generate slug
        const slug =
            generateSlug(name);

        // 4. Check duplicate name
        const existingName =
            await findCategoryByName(
                name
            );

        if (
            existingName.length > 0
        ) {
            throw new AppError(
                "Category name is already registered",
                409
            );
        }

        // 5. Check duplicate slug
        const existingSlug =
            await findCategoryBySlug(
                slug
            );

        if (
            existingSlug.length > 0
        ) {
            throw new AppError(
                "Category slug is already registered",
                409
            );
        }

        // 6. Validate parent
        if (parentId) {
            await validateParentCategory(
                parentId
            );
        }

        // 7. Generate category ID
        const categoryId =
            randomUUID();

        // 8. Create category
        await createCategory(
            categoryId,
            name,
            slug,
            description,
            parentId
        );

        // 9. Return safe response
        return {
            id: categoryId,
            name,
            slug,
            description,
            parentId
        };
    };

export const getCategoryByIdService =
    async (
        categoryId: string
    ) => {
        const categories =
            await findCategoryById(
                categoryId
            );

        if (
            categories.length === 0
        ) {
            throw new AppError(
                "Category not found",
                404
            );
        }

        const category =
            categories[0];

        return {
            id: category.id,
            name: category.name,
            slug: category.slug,
            description:
                category.description,
            parentId:
                category.parent_id,
            status:
                category.status,
            createdAt:
                category.created_at,
            updatedAt:
                category.updated_at
        };
    };

export const getCategoriesService =
    async () => {
        const categories =
            await findActiveCategories();

        return categories.map(
            (category) => ({
                id: category.id,
                name: category.name,
                slug: category.slug,
                description:
                    category.description,
                parentId:
                    category.parent_id,
                status:
                    category.status,
                createdAt:
                    category.created_at,
                updatedAt:
                    category.updated_at
            })
        );
    };

export const updateCategoryService =
    async (
        categoryId: string,
        data: UpdateCategoryDto
    ) => {
        // 1. Validate request
        const validationErrors =
            validateUpdateCategory(data);

        if (
            validationErrors.length > 0
        ) {
            throw new AppError(
                validationErrors.join(", "),
                400
            );
        }

        // 2. Find existing category
        const existingCategories =
            await findCategoryById(
                categoryId
            );

        if (
            existingCategories.length === 0
        ) {
            throw new AppError(
                "Category not found",
                404
            );
        }

        const existing =
            existingCategories[0];

        if (
            existing.status !== "ACTIVE"
        ) {
            throw new AppError(
                "Category is not active",
                400
            );
        }

        // 3. Normalize input
        const name =
            data.name.trim();

        const description =
            data.description !== undefined
                ? data.description.trim()
                : existing.description;

        const parentId =
            data.parentId !== undefined
                ? data.parentId
                    ? data.parentId.trim()
                    : null
                : existing.parent_id;

        // 4. Generate slug
        const slug =
            generateSlug(name);

        // 5. Check duplicate name
        const categoryWithName =
            await findCategoryByName(
                name
            );

        if (
            categoryWithName.length > 0 &&
            categoryWithName[0].id !==
                categoryId
        ) {
            throw new AppError(
                "Category name is already registered",
                409
            );
        }

        // 6. Check duplicate slug
        const categoryWithSlug =
            await findCategoryBySlug(
                slug
            );

        if (
            categoryWithSlug.length > 0 &&
            categoryWithSlug[0].id !==
                categoryId
        ) {
            throw new AppError(
                "Category slug is already registered",
                409
            );
        }

        // 7. Validate parent
        if (parentId) {
            await validateParentCategory(
                parentId,
                categoryId
            );

            // 8. Prevent circular hierarchy
            await validateNoCircularReference(
                categoryId,
                parentId
            );
        }

        // 9. Update category
        await updateCategory(
            categoryId,
            name,
            slug,
            description,
            parentId
        );

        // 10. Return updated data
        return {
            id: categoryId,
            name,
            slug,
            description,
            parentId
        };
    };

export const deleteCategoryService =
    async (
        categoryId: string
    ) => {
        // 1. Find category
        const categories =
            await findCategoryById(
                categoryId
            );

        if (
            categories.length === 0
        ) {
            throw new AppError(
                "Category not found",
                404
            );
        }

        const category =
            categories[0];

        // 2. Check status
        if (
            category.status !== "ACTIVE"
        ) {
            throw new AppError(
                "Category is already inactive",
                400
            );
        }

        // 3. Soft delete
        await deleteCategory(
            categoryId
        );

        return {
            id: categoryId
        };
    };