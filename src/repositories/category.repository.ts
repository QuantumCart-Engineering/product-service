import pool from "../config/database";

import {
    RowDataPacket,
    ResultSetHeader
} from "mysql2";

import {
    CREATE_CATEGORY,
    FIND_CATEGORY_BY_ID,
    FIND_CATEGORY_BY_SLUG,
    FIND_CATEGORY_BY_NAME,
    FIND_ACTIVE_CATEGORIES,
    UPDATE_CATEGORY,
    DELETE_CATEGORY
} from "../queries/category.queries";

export interface CategoryRow
    extends RowDataPacket {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    parent_id: string | null;
    status:
        | "ACTIVE"
        | "INACTIVE";
    created_at: Date;
    updated_at: Date;
}

export const createCategory = async (
    id: string,
    name: string,
    slug: string,
    description: string | null,
    parentId: string | null
): Promise<ResultSetHeader> => {
    const [result] =
        await pool.execute<ResultSetHeader>(
            CREATE_CATEGORY,
            [
                id,
                name,
                slug,
                description,
                parentId
            ]
        );

    return result;
};

export const findCategoryById = async (
    id: string
): Promise<CategoryRow[]> => {
    const [rows] =
        await pool.execute<CategoryRow[]>(
            FIND_CATEGORY_BY_ID,
            [id]
        );

    return rows;
};

export const findCategoryBySlug = async (
    slug: string
): Promise<CategoryRow[]> => {
    const [rows] =
        await pool.execute<CategoryRow[]>(
            FIND_CATEGORY_BY_SLUG,
            [slug]
        );

    return rows;
};

export const findCategoryByName = async (
    name: string
): Promise<CategoryRow[]> => {
    const [rows] =
        await pool.execute<CategoryRow[]>(
            FIND_CATEGORY_BY_NAME,
            [name]
        );

    return rows;
};

export const findActiveCategories =
    async (): Promise<CategoryRow[]> => {
        const [rows] =
            await pool.execute<CategoryRow[]>(
                FIND_ACTIVE_CATEGORIES
            );

        return rows;
    };

export const updateCategory = async (
    id: string,
    name: string,
    slug: string,
    description: string | null,
    parentId: string | null
): Promise<ResultSetHeader> => {
    const [result] =
        await pool.execute<ResultSetHeader>(
            UPDATE_CATEGORY,
            [
                name,
                slug,
                description,
                parentId,
                id
            ]
        );

    return result;
};

export const deleteCategory = async (
    id: string
): Promise<ResultSetHeader> => {
    const [result] =
        await pool.execute<ResultSetHeader>(
            DELETE_CATEGORY,
            [id]
        );

    return result;
};