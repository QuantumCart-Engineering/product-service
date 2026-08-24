export const createProductQuery = `
    INSERT INTO products (
        id,
        name,
        slug,
        description,
        price,
        sku,
        stock_quantity
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
`;

export const findProductByIdQuery = `
    SELECT
        id,
        name,
        slug,
        description,
        price,
        sku,
        stock_quantity,
        status,
        created_at,
        updated_at
    FROM products
    WHERE id = ?
    LIMIT 1
`;

export const findProductBySkuQuery = `
    SELECT
        id,
        name,
        slug,
        description,
        price,
        sku,
        stock_quantity,
        status,
        created_at,
        updated_at
    FROM products
    WHERE sku = ?
    LIMIT 1
`;

export const findProductBySlugQuery = `
    SELECT
        id,
        name,
        slug,
        description,
        price,
        sku,
        stock_quantity,
        status,
        created_at,
        updated_at
    FROM products
    WHERE slug = ?
    LIMIT 1
`;

export const updateProductQuery = `
    UPDATE products
    SET
        name = ?,
        slug = ?,
        description = ?,
        price = ?,
        sku = ?,
        stock_quantity = ?,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
`;

export const deleteProductQuery = `
    UPDATE products
    SET
        status = 'INACTIVE',
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
`;

export const findActiveProductsQuery = `
    SELECT
        p.id,
        p.name,
        p.slug,
        p.description,
        p.price,
        p.sku,
        p.stock_quantity,
        p.status,
        p.created_at,
        p.updated_at
    FROM products p
    WHERE p.status = 'ACTIVE'
    ORDER BY p.created_at DESC, p.id DESC
    LIMIT ?
`;

export const findActiveProductsByCursorQuery = `
    SELECT
        p.id,
        p.name,
        p.slug,
        p.description,
        p.price,
        p.sku,
        p.stock_quantity,
        p.status,
        p.created_at,
        p.updated_at
    FROM products p
    WHERE p.status = 'ACTIVE'
      AND (
          p.created_at < ?
          OR (
              p.created_at = ?
              AND p.id < ?
          )
      )
    ORDER BY p.created_at DESC, p.id DESC
    LIMIT ?
`;

export const findProductsByCategoryQuery = `
    SELECT
        p.id,
        p.name,
        p.slug,
        p.description,
        p.price,
        p.sku,
        p.stock_quantity,
        p.status,
        p.created_at,
        p.updated_at
    FROM products p
    INNER JOIN product_categories pc
        ON pc.product_id = p.id
    WHERE p.status = 'ACTIVE'
      AND pc.category_id = ?
    ORDER BY p.created_at DESC, p.id DESC
    LIMIT ?
`;

export const findProductsByCategoryAndCursorQuery = `
    SELECT
        p.id,
        p.name,
        p.slug,
        p.description,
        p.price,
        p.sku,
        p.stock_quantity,
        p.status,
        p.created_at,
        p.updated_at
    FROM products p
    INNER JOIN product_categories pc
        ON pc.product_id = p.id
    WHERE p.status = 'ACTIVE'
      AND pc.category_id = ?
      AND (
          p.created_at < ?
          OR (
              p.created_at = ?
              AND p.id < ?
          )
      )
    ORDER BY p.created_at DESC, p.id DESC
    LIMIT ?
`;

export const searchProductsQuery = `
    SELECT
        p.id,
        p.name,
        p.slug,
        p.description,
        p.price,
        p.sku,
        p.stock_quantity,
        p.status,
        p.created_at,
        p.updated_at
    FROM products p
    WHERE p.status = 'ACTIVE'
      AND (
          p.name LIKE ?
          OR p.sku LIKE ?
          OR p.description LIKE ?
      )
    ORDER BY p.created_at DESC, p.id DESC
    LIMIT ?
`;

export const searchProductsByCursorQuery = `
    SELECT
        p.id,
        p.name,
        p.slug,
        p.description,
        p.price,
        p.sku,
        p.stock_quantity,
        p.status,
        p.created_at,
        p.updated_at
    FROM products p
    WHERE p.status = 'ACTIVE'
      AND (
          p.name LIKE ?
          OR p.sku LIKE ?
          OR p.description LIKE ?
      )
      AND (
          p.created_at < ?
          OR (
              p.created_at = ?
              AND p.id < ?
          )
      )
    ORDER BY p.created_at DESC, p.id DESC
    LIMIT ?
`;

export const createProductCategoryQuery = `
    INSERT INTO product_categories (
        product_id,
        category_id
    )
    VALUES (?, ?)
`;

export const findProductCategoriesQuery = `
    SELECT
        category_id
    FROM product_categories
    WHERE product_id = ?
`;

export const deleteProductCategoriesQuery = `
    DELETE FROM product_categories
    WHERE product_id = ?
`;

export const findProductCategoryExistsQuery = `
    SELECT
        product_id,
        category_id
    FROM product_categories
    WHERE product_id = ?
      AND category_id = ?
    LIMIT 1
`;
