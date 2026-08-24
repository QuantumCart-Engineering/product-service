import {
    createCategoryService,
    getCategoryByIdService,
    getCategoriesService,
    updateCategoryService,
    deleteCategoryService
} from "../../../services/category.service";

import {
    createCategory,
    findCategoryById,
    findCategoryByName,
    findCategoryBySlug,
    findActiveCategories,
    updateCategory,
    deleteCategory
} from "../../../repositories/category.repository";

jest.mock(
    "../../../repositories/category.repository",
    () => ({
        createCategory: jest.fn(),
        findCategoryById: jest.fn(),
        findCategoryByName: jest.fn(),
        findCategoryBySlug: jest.fn(),
        findActiveCategories: jest.fn(),
        updateCategory: jest.fn(),
        deleteCategory: jest.fn()
    })
);

const mockedCreateCategory =
    createCategory as jest.Mock;

const mockedFindCategoryById =
    findCategoryById as jest.Mock;

const mockedFindCategoryByName =
    findCategoryByName as jest.Mock;

const mockedFindCategoryBySlug =
    findCategoryBySlug as jest.Mock;

const mockedFindActiveCategories =
    findActiveCategories as jest.Mock;

const mockedUpdateCategory =
    updateCategory as jest.Mock;

const mockedDeleteCategory =
    deleteCategory as jest.Mock;

describe("Category Service", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("createCategoryService", () => {
        it("should create a category successfully", async () => {
            mockedFindCategoryByName.mockResolvedValue(
                []
            );

            mockedFindCategoryBySlug.mockResolvedValue(
                []
            );

            mockedCreateCategory.mockResolvedValue(
                {
                    affectedRows: 1
                }
            );

            const result =
                await createCategoryService({
                    name: "Electronics",
                    description:
                        "Electronic products"
                });

            expect(
                mockedFindCategoryByName
            ).toHaveBeenCalledWith(
                "Electronics"
            );

            expect(
                mockedFindCategoryBySlug
            ).toHaveBeenCalledWith(
                "electronics"
            );

            expect(
                mockedCreateCategory
            ).toHaveBeenCalledWith(
                expect.any(String),
                "Electronics",
                "electronics",
                "Electronic products",
                null
            );

            expect(result).toMatchObject({
                name: "Electronics",
                slug: "electronics",
                description:
                    "Electronic products",
                parentId: null
            });

            expect(result.id).toEqual(
                expect.any(String)
            );
        });

        it("should reject when category name is missing", async () => {
            await expect(
                createCategoryService({
                    name: ""
                })
            ).rejects.toThrow(
                "Category name is required"
            );

            expect(
                mockedCreateCategory
            ).not.toHaveBeenCalled();
        });

        it("should reject when category name already exists", async () => {
            mockedFindCategoryByName.mockResolvedValue(
                [
                    {
                        id: "existing-id",
                        name: "Electronics"
                    }
                ]
            );

            await expect(
                createCategoryService({
                    name: "Electronics"
                })
            ).rejects.toThrow(
                "Category name is already registered"
            );

            expect(
                mockedFindCategoryBySlug
            ).not.toHaveBeenCalled();

            expect(
                mockedCreateCategory
            ).not.toHaveBeenCalled();
        });

        it("should reject when category slug already exists", async () => {
            mockedFindCategoryByName.mockResolvedValue(
                []
            );

            mockedFindCategoryBySlug.mockResolvedValue(
                [
                    {
                        id: "existing-id",
                        slug: "electronics"
                    }
                ]
            );

            await expect(
                createCategoryService({
                    name: "Electronics"
                })
            ).rejects.toThrow(
                "Category slug is already registered"
            );

            expect(
                mockedCreateCategory
            ).not.toHaveBeenCalled();
        });

        it("should reject when parent category does not exist", async () => {
            mockedFindCategoryByName.mockResolvedValue(
                []
            );

            mockedFindCategoryBySlug.mockResolvedValue(
                []
            );

            mockedFindCategoryById.mockResolvedValue(
                []
            );

            await expect(
                createCategoryService({
                    name: "Smartphones",
                    parentId: "invalid-parent-id"
                })
            ).rejects.toThrow(
                "Parent category not found"
            );

            expect(
                mockedCreateCategory
            ).not.toHaveBeenCalled();
        });

        it("should reject when parent category is inactive", async () => {
            mockedFindCategoryByName.mockResolvedValue(
                []
            );

            mockedFindCategoryBySlug.mockResolvedValue(
                []
            );

            mockedFindCategoryById.mockResolvedValue(
                [
                    {
                        id: "parent-id",
                        status: "INACTIVE"
                    }
                ]
            );

            await expect(
                createCategoryService({
                    name: "Smartphones",
                    parentId: "parent-id"
                })
            ).rejects.toThrow(
                "Parent category is not active"
            );

            expect(
                mockedCreateCategory
            ).not.toHaveBeenCalled();
        });

        it("should create a child category with a valid parent", async () => {
            mockedFindCategoryByName.mockResolvedValue(
                []
            );

            mockedFindCategoryBySlug.mockResolvedValue(
                []
            );

            mockedFindCategoryById.mockResolvedValue(
                [
                    {
                        id: "parent-id",
                        status: "ACTIVE"
                    }
                ]
            );

            mockedCreateCategory.mockResolvedValue(
                {
                    affectedRows: 1
                }
            );

            const result =
                await createCategoryService({
                    name: "Smartphones",
                    parentId: "parent-id"
                });

            expect(
                mockedCreateCategory
            ).toHaveBeenCalledWith(
                expect.any(String),
                "Smartphones",
                "smartphones",
                null,
                "parent-id"
            );

            expect(result).toMatchObject({
                name: "Smartphones",
                parentId: "parent-id"
            });
        });
    });

    describe("getCategoryByIdService", () => {
        it("should return category successfully", async () => {
            const category = {
                id: "category-id",
                name: "Electronics",
                slug: "electronics",
                description:
                    "Electronic products",
                parent_id: null,
                status: "ACTIVE",
                created_at: new Date(),
                updated_at: new Date()
            };

            mockedFindCategoryById.mockResolvedValue(
                [category]
            );

            const result =
                await getCategoryByIdService(
                    "category-id"
                );

            expect(
                mockedFindCategoryById
            ).toHaveBeenCalledWith(
                "category-id"
            );

            expect(result).toEqual({
                id: "category-id",
                name: "Electronics",
                slug: "electronics",
                description:
                    "Electronic products",
                parentId: null,
                status: "ACTIVE",
                createdAt:
                    category.created_at,
                updatedAt:
                    category.updated_at
            });
        });

        it("should reject when category does not exist", async () => {
            mockedFindCategoryById.mockResolvedValue(
                []
            );

            await expect(
                getCategoryByIdService(
                    "invalid-id"
                )
            ).rejects.toThrow(
                "Category not found"
            );
        });
    });

    describe("getCategoriesService", () => {
        it("should return active categories", async () => {
            const categories = [
                {
                    id: "category-1",
                    name: "Electronics",
                    slug: "electronics",
                    description: null,
                    parent_id: null,
                    status: "ACTIVE",
                    created_at: new Date(),
                    updated_at: new Date()
                },
                {
                    id: "category-2",
                    name: "Mobiles",
                    slug: "mobiles",
                    description:
                        "Mobile phones",
                    parent_id:
                        "category-1",
                    status: "ACTIVE",
                    created_at: new Date(),
                    updated_at: new Date()
                }
            ];

            mockedFindActiveCategories.mockResolvedValue(
                categories
            );

            const result =
                await getCategoriesService();

            expect(
                mockedFindActiveCategories
            ).toHaveBeenCalledTimes(1);

            expect(result).toHaveLength(2);

            expect(result[0]).toMatchObject({
                id: "category-1",
                name: "Electronics",
                parentId: null
            });

            expect(result[1]).toMatchObject({
                id: "category-2",
                name: "Mobiles",
                parentId:
                    "category-1"
            });
        });

        it("should return empty array when no active categories exist", async () => {
            mockedFindActiveCategories.mockResolvedValue(
                []
            );

            const result =
                await getCategoriesService();

            expect(result).toEqual([]);
        });
    });

    describe("updateCategoryService", () => {
        it("should update category successfully", async () => {
            mockedFindCategoryById
                .mockResolvedValueOnce([
                    {
                        id: "category-id",
                        name: "Electronics",
                        slug: "electronics",
                        description: null,
                        parent_id: null,
                        status: "ACTIVE"
                    }
                ])
                .mockResolvedValueOnce([]);

            mockedFindCategoryByName.mockResolvedValue(
                []
            );

            mockedFindCategoryBySlug.mockResolvedValue(
                []
            );

            mockedUpdateCategory.mockResolvedValue(
                {
                    affectedRows: 1
                }
            );

            const result =
                await updateCategoryService(
                    "category-id",
                    {
                        name: "Consumer Electronics",
                        description:
                            "Updated description"
                    }
                );

            expect(
                mockedUpdateCategory
            ).toHaveBeenCalledWith(
                "category-id",
                "Consumer Electronics",
                "consumer-electronics",
                "Updated description",
                null
            );

            expect(result).toEqual({
                id: "category-id",
                name:
                    "Consumer Electronics",
                slug:
                    "consumer-electronics",
                description:
                    "Updated description",
                parentId: null
            });
        });

        it("should reject when category does not exist", async () => {
            mockedFindCategoryById.mockResolvedValue(
                []
            );

            await expect(
                updateCategoryService(
                    "invalid-id",
                    {
                        name: "Electronics"
                    }
                )
            ).rejects.toThrow(
                "Category not found"
            );

            expect(
                mockedUpdateCategory
            ).not.toHaveBeenCalled();
        });

        it("should reject when category is inactive", async () => {
            mockedFindCategoryById.mockResolvedValue(
                [
                    {
                        id: "category-id",
                        status: "INACTIVE"
                    }
                ]
            );

            await expect(
                updateCategoryService(
                    "category-id",
                    {
                        name: "Electronics"
                    }
                )
            ).rejects.toThrow(
                "Category is not active"
            );
        });

        it("should reject duplicate category name during update", async () => {
            mockedFindCategoryById.mockResolvedValue(
                [
                    {
                        id: "category-id",
                        status: "ACTIVE",
                        parent_id: null,
                        description: null
                    }
                ]
            );

            mockedFindCategoryByName.mockResolvedValue(
                [
                    {
                        id: "another-category-id",
                        name: "Electronics"
                    }
                ]
            );

            await expect(
                updateCategoryService(
                    "category-id",
                    {
                        name: "Electronics"
                    }
                )
            ).rejects.toThrow(
                "Category name is already registered"
            );

            expect(
                mockedUpdateCategory
            ).not.toHaveBeenCalled();
        });

        it("should reject duplicate slug during update", async () => {
            mockedFindCategoryById.mockResolvedValue(
                [
                    {
                        id: "category-id",
                        status: "ACTIVE",
                        parent_id: null,
                        description: null
                    }
                ]
            );

            mockedFindCategoryByName.mockResolvedValue(
                []
            );

            mockedFindCategoryBySlug.mockResolvedValue(
                [
                    {
                        id: "another-category-id",
                        slug: "electronics"
                    }
                ]
            );

            await expect(
                updateCategoryService(
                    "category-id",
                    {
                        name: "Electronics"
                    }
                )
            ).rejects.toThrow(
                "Category slug is already registered"
            );
        });

        it("should reject when category becomes its own parent", async () => {
            mockedFindCategoryById.mockResolvedValue(
                [
                    {
                        id: "category-id",
                        status: "ACTIVE",
                        parent_id: null,
                        description: null
                    }
                ]
            );

            mockedFindCategoryByName.mockResolvedValue(
                []
            );

            mockedFindCategoryBySlug.mockResolvedValue(
                []
            );

            await expect(
                updateCategoryService(
                    "category-id",
                    {
                        name: "Electronics",
                        parentId:
                            "category-id"
                    }
                )
            ).rejects.toThrow(
                "Category cannot be its own parent"
            );

            expect(
                mockedUpdateCategory
            ).not.toHaveBeenCalled();
        });

        it("should reject circular category hierarchy", async () => {
            mockedFindCategoryById
                .mockResolvedValueOnce([
                    {
                        id: "category-a",
                        status: "ACTIVE",
                        parent_id:
                            "category-b",
                        description: null
                    }
                ])
                .mockResolvedValueOnce([
                    {
                        id: "category-b",
                        status: "ACTIVE",
                        parent_id:
                            "category-c"
                    }
                ])
                .mockResolvedValueOnce([
                    {
                        id: "category-c",
                        status: "ACTIVE",
                        parent_id:
                            "category-a"
                    }
                ]);

            mockedFindCategoryByName.mockResolvedValue(
                []
            );

            mockedFindCategoryBySlug.mockResolvedValue(
                []
            );

            await expect(
                updateCategoryService(
                    "category-a",
                    {
                        name: "Category A",
                        parentId:
                            "category-b"
                    }
                )
            ).rejects.toThrow(
                "Circular category hierarchy is not allowed"
            );

            expect(
                mockedUpdateCategory
            ).not.toHaveBeenCalled();
        });

        it("should allow update when parent hierarchy ends at a missing ancestor", async () => {
            mockedFindCategoryById
                .mockResolvedValueOnce([
                    {
                        id: "category-id",
                        status: "ACTIVE",
                        parent_id: null,
                        description: null
                    }
                ])
                .mockResolvedValueOnce([
                    {
                        id: "parent-id",
                        status: "ACTIVE",
                        parent_id: "missing-ancestor"
                    }
                ])
                .mockResolvedValueOnce([]);

            mockedFindCategoryByName.mockResolvedValue([]);

            mockedFindCategoryBySlug.mockResolvedValue([]);

            mockedUpdateCategory.mockResolvedValue({
                affectedRows: 1
            });

            const result =
                await updateCategoryService(
                    "category-id",
                    {
                        name: "Electronics",
                        parentId: "parent-id"
                    }
                );

            expect(result).toEqual({
                id: "category-id",
                name: "Electronics",
                slug: "electronics",
                description: null,
                parentId: "parent-id"
            });

            expect(
                mockedUpdateCategory
            ).toHaveBeenCalledWith(
                "category-id",
                "Electronics",
                "electronics",
                null,
                "parent-id"
            );
        });

        it("should reject when the parent hierarchy contains a repeated category", async () => {
            mockedFindCategoryById
                .mockResolvedValueOnce([
                    {
                        id: "category-a",
                        status: "ACTIVE",
                        parent_id: null,
                        description: null
                    }
                ])
                .mockResolvedValueOnce([
                    {
                        id: "category-b",
                        status: "ACTIVE",
                        parent_id: "category-c"
                    }
                ])
                .mockResolvedValueOnce([
                    {
                        id: "category-c",
                        status: "ACTIVE",
                        parent_id: "category-b"
                    }
                ])
                .mockResolvedValueOnce([
                    {
                        id: "category-b",
                        status: "ACTIVE",
                        parent_id: "category-c"
                    }
                ]);

            mockedFindCategoryByName.mockResolvedValue([]);

            mockedFindCategoryBySlug.mockResolvedValue([]);

            await expect(
                updateCategoryService(
                    "category-a",
                    {
                        name: "Category A",
                        parentId: "category-b"
                    }
                )
            ).rejects.toThrow(
                "Circular category hierarchy detected"
            );

            expect(
                mockedUpdateCategory
            ).not.toHaveBeenCalled();
        });

        it("should reject when update parent does not exist", async () => {
            mockedFindCategoryById.mockReset();

            mockedFindCategoryById.mockImplementation(
                async (id: string) => {
                    if (id === "category-id") {
                        return [
                            {
                                id: "category-id",
                                name: "Electronics",
                                slug: "electronics",
                                description: null,
                                parent_id: null,
                                status: "ACTIVE",
                                created_at: new Date(),
                                updated_at: new Date()
                            }
                        ];
                    }

                    if (id === "invalid-parent") {
                        return [];
                    }

                    return [];
                }
            );

            await expect(
                updateCategoryService(
                    "category-id",
                    {
                        name: "Electronics",
                        parentId: "invalid-parent"
                    }
                )
            ).rejects.toThrow(
                "Parent category not found"
            );

            expect(
                mockedUpdateCategory
            ).not.toHaveBeenCalled();
        });

        it("should reject update when validation fails", async () => {
            await expect(
                updateCategoryService(
                    "category-id",
                    {
                        name: ""
                    }
                )
            ).rejects.toThrow(
                "Category name is required"
            );

            expect(
                mockedFindCategoryById
            ).not.toHaveBeenCalled();

            expect(
                mockedUpdateCategory
            ).not.toHaveBeenCalled();
        });
    });

    describe("deleteCategoryService", () => {
        it("should delete category successfully", async () => {
            mockedFindCategoryById.mockResolvedValue(
                [
                    {
                        id: "category-id",
                        status: "ACTIVE"
                    }
                ]
            );

            mockedDeleteCategory.mockResolvedValue(
                {
                    affectedRows: 1
                }
            );

            const result =
                await deleteCategoryService(
                    "category-id"
                );

            expect(
                mockedDeleteCategory
            ).toHaveBeenCalledWith(
                "category-id"
            );

            expect(result).toEqual({
                id: "category-id"
            });
        });

        it("should reject when category does not exist", async () => {
            mockedFindCategoryById.mockResolvedValue(
                []
            );

            await expect(
                deleteCategoryService(
                    "invalid-id"
                )
            ).rejects.toThrow(
                "Category not found"
            );

            expect(
                mockedDeleteCategory
            ).not.toHaveBeenCalled();
        });

        it("should reject when category is already inactive", async () => {
            mockedFindCategoryById.mockResolvedValue(
                [
                    {
                        id: "category-id",
                        status: "INACTIVE"
                    }
                ]
            );

            await expect(
                deleteCategoryService(
                    "category-id"
                )
            ).rejects.toThrow(
                "Category is already inactive"
            );

            expect(
                mockedDeleteCategory
            ).not.toHaveBeenCalled();
        });
    });
});