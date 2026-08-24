export const CREATE_CATEGORY = `
    INSERT INTO categories (
        id,
        name,
        slug,
        description,
        parent_id
    )
    VALUES (?, ?, ?, ?, ?)
`;

export const FIND_CATEGORY_BY_ID = `
    SELECT
        id,
        name,
        slug,
        description,
        parent_id,
        status,
        created_at,
        updated_at
    FROM categories
    WHERE id = ?
    LIMIT 1
`;

export const FIND_CATEGORY_BY_SLUG = `
    SELECT
        id,
        name,
        slug,
        description,
        parent_id,
        status,
        created_at,
        updated_at
    FROM categories
    WHERE slug = ?
    LIMIT 1
`;

export const FIND_CATEGORY_BY_NAME = `
    SELECT
        id,
        name,
        slug,
        description,
        parent_id,
        status,
        created_at,
        updated_at
    FROM categories
    WHERE name = ?
    LIMIT 1
`;

export const FIND_ACTIVE_CATEGORIES = `
    SELECT
        id,
        name,
        slug,
        description,
        parent_id,
        status,
        created_at,
        updated_at
    FROM categories
    WHERE status = 'ACTIVE'
    ORDER BY name ASC
`;

export const UPDATE_CATEGORY = `
    UPDATE categories
    SET
        name = ?,
        slug = ?,
        description = ?,
        parent_id = ?
    WHERE id = ?
`;

export const DELETE_CATEGORY = `
    UPDATE categories
    SET
        status = 'INACTIVE'
    WHERE id = ?
`;