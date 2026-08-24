CREATE TABLE IF NOT EXISTS categories (
    id CHAR(36) NOT NULL,

    name VARCHAR(150) NOT NULL,

    slug VARCHAR(180) NOT NULL,

    description TEXT NULL,

    parent_id CHAR(36) NULL,

    status ENUM(
        'ACTIVE',
        'INACTIVE'
    ) NOT NULL DEFAULT 'ACTIVE',

    created_at TIMESTAMP NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    UNIQUE KEY uk_categories_name (name),

    UNIQUE KEY uk_categories_slug (slug),

    INDEX idx_categories_parent_id (
        parent_id
    ),

    INDEX idx_categories_status (
        status
    ),

    INDEX idx_categories_created_at (
        created_at
    ),

    CONSTRAINT fk_categories_parent
        FOREIGN KEY (parent_id)
        REFERENCES categories(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);