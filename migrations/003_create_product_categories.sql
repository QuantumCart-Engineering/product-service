CREATE TABLE IF NOT EXISTS product_categories (
    product_id CHAR(36) NOT NULL,

    category_id CHAR(36) NOT NULL,

    created_at TIMESTAMP NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (
        product_id,
        category_id
    ),

    CONSTRAINT fk_product_categories_product
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_product_categories_category
        FOREIGN KEY (category_id)
        REFERENCES categories(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    INDEX idx_product_categories_category_product (
        category_id,
        product_id
    )
);