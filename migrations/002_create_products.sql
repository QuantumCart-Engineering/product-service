CREATE TABLE IF NOT EXISTS products (
    id CHAR(36) NOT NULL,

    sku VARCHAR(100) NOT NULL,

    name VARCHAR(255) NOT NULL,

    slug VARCHAR(280) NOT NULL,

    description TEXT NULL,

    price DECIMAL(12, 2) NOT NULL,

    currency CHAR(3) NOT NULL DEFAULT 'INR',

    stock_quantity INT UNSIGNED NOT NULL DEFAULT 0,

    status ENUM(
        'ACTIVE',
        'INACTIVE',
        'OUT_OF_STOCK',
        'ARCHIVED'
    ) NOT NULL DEFAULT 'ACTIVE',

    created_at TIMESTAMP NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    UNIQUE KEY uk_products_sku (
        sku
    ),

    UNIQUE KEY uk_products_slug (
        slug
    ),

    INDEX idx_products_status_created_id (
        status,
        created_at,
        id
    ),

    INDEX idx_products_created_id (
        created_at,
        id
    )
);