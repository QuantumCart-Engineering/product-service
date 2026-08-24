import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
    openapi: "3.0.0",

    info: {
        title: "QuantumCart Product Service API",
        version: "1.0.0",
        description:
            "REST API for managing products and categories in the QuantumCart e-commerce platform."
    },

    servers: [
        {
            url: "http://localhost:8002",
            description: "Local development server"
        }
    ],

    tags: [
        {
            name: "Health",
            description: "Service health endpoints"
        },
        {
            name: "Categories",
            description:
                "Product category management endpoints"
        },
        {
            name: "Products",
            description:
                "Product management and listing endpoints"
        }
    ],

    components: {
        schemas: {
            Category: {
                type: "object",
                properties: {
                    id: {
                        type: "string",
                        format: "uuid",
                        example:
                            "3ecbb435-e3ea-443f-a47a-22203e28546b"
                    },
                    name: {
                        type: "string",
                        maxLength: 150,
                        example: "Electronics"
                    },
                    slug: {
                        type: "string",
                        maxLength: 180,
                        example: "electronics"
                    },
                    description: {
                        type: "string",
                        nullable: true,
                        example: "Electronic products"
                    },
                    parentId: {
                        type: "string",
                        format: "uuid",
                        nullable: true,
                        example: null
                    },
                    status: {
                        type: "string",
                        enum: [
                            "ACTIVE",
                            "INACTIVE"
                        ],
                        example: "ACTIVE"
                    },
                    createdAt: {
                        type: "string",
                        format: "date-time"
                    },
                    updatedAt: {
                        type: "string",
                        format: "date-time"
                    }
                }
            },

            CreateCategoryRequest: {
                type: "object",
                required: ["name"],
                properties: {
                    name: {
                        type: "string",
                        minLength: 1,
                        maxLength: 150,
                        example: "Electronics"
                    },
                    description: {
                        type: "string",
                        example:
                            "Electronic products"
                    },
                    parentId: {
                        type: "string",
                        format: "uuid",
                        example:
                            "3ecbb435-e3ea-443f-a47a-22203e28546b"
                    }
                }
            },

            UpdateCategoryRequest: {
                type: "object",
                required: ["name"],
                properties: {
                    name: {
                        type: "string",
                        minLength: 1,
                        maxLength: 150,
                        example:
                            "Consumer Electronics"
                    },
                    description: {
                        type: "string",
                        example:
                            "Updated category description"
                    },
                    parentId: {
                        type: "string",
                        format: "uuid",
                        nullable: true,
                        example: null
                    }
                }
            },

            Product: {
                type: "object",
                properties: {
                    id: {
                        type: "string",
                        format: "uuid",
                        example:
                            "550e8400-e29b-41d4-a716-446655440000"
                    },
                    name: {
                        type: "string",
                        maxLength: 255,
                        example:
                            "Wireless Headphones"
                    },
                    slug: {
                        type: "string",
                        maxLength: 280,
                        example:
                            "wireless-headphones"
                    },
                    description: {
                        type: "string",
                        nullable: true,
                        example:
                            "Bluetooth wireless headphones"
                    },
                    price: {
                        type: "number",
                        format: "double",
                        minimum: 0.01,
                        example: 2499.99
                    },
                    currency: {
                        type: "string",
                        minLength: 3,
                        maxLength: 3,
                        example: "INR"
                    },
                    sku: {
                        type: "string",
                        maxLength: 100,
                        example: "WH-1000"
                    },
                    stock_quantity: {
                        type: "integer",
                        minimum: 0,
                        example: 50
                    },
                    status: {
                        type: "string",
                        enum: [
                            "ACTIVE",
                            "INACTIVE",
                            "OUT_OF_STOCK",
                            "ARCHIVED"
                        ],
                        example: "ACTIVE"
                    },
                    created_at: {
                        type: "string",
                        format: "date-time"
                    },
                    updated_at: {
                        type: "string",
                        format: "date-time"
                    }
                }
            },

            ProductWithCategories: {
                allOf: [
                    {
                        $ref:
                            "#/components/schemas/Product"
                    },
                    {
                        type: "object",
                        properties: {
                            categoryIds: {
                                type: "array",
                                items: {
                                    type: "string",
                                    format: "uuid"
                                },
                                example: [
                                    "3ecbb435-e3ea-443f-a47a-22203e28546b"
                                ]
                            }
                        }
                    }
                ]
            },

            CreateProductRequest: {
                type: "object",
                required: [
                    "name",
                    "price",
                    "sku",
                    "stockQuantity",
                    "categoryIds"
                ],
                properties: {
                    name: {
                        type: "string",
                        minLength: 2,
                        maxLength: 255,
                        example:
                            "Wireless Headphones"
                    },
                    slug: {
                        type: "string",
                        maxLength: 280,
                        example:
                            "wireless-headphones"
                    },
                    description: {
                        type: "string",
                        example:
                            "Bluetooth wireless headphones"
                    },
                    price: {
                        type: "number",
                        format: "double",
                        exclusiveMinimum: 0,
                        example: 2499.99
                    },
                    sku: {
                        type: "string",
                        minLength: 2,
                        maxLength: 100,
                        example: "WH-1000"
                    },
                    stockQuantity: {
                        type: "integer",
                        minimum: 0,
                        example: 50
                    },
                    categoryIds: {
                        type: "array",
                        minItems: 1,
                        uniqueItems: true,
                        items: {
                            type: "string",
                            format: "uuid"
                        },
                        example: [
                            "3ecbb435-e3ea-443f-a47a-22203e28546b"
                        ]
                    }
                }
            },

            UpdateProductRequest: {
                type: "object",
                minProperties: 1,
                properties: {
                    name: {
                        type: "string",
                        minLength: 2,
                        maxLength: 255,
                        example:
                            "Updated Wireless Headphones"
                    },
                    slug: {
                        type: "string",
                        maxLength: 280,
                        example:
                            "updated-wireless-headphones"
                    },
                    description: {
                        type: "string",
                        example:
                            "Updated description"
                    },
                    price: {
                        type: "number",
                        format: "double",
                        exclusiveMinimum: 0,
                        example: 2299.99
                    },
                    sku: {
                        type: "string",
                        minLength: 2,
                        maxLength: 100,
                        example: "WH-1001"
                    },
                    stockQuantity: {
                        type: "integer",
                        minimum: 0,
                        example: 75
                    },
                    categoryIds: {
                        type: "array",
                        minItems: 1,
                        uniqueItems: true,
                        items: {
                            type: "string",
                            format: "uuid"
                        }
                    }
                }
            },

            ErrorResponse: {
                type: "object",
                properties: {
                    success: {
                        type: "boolean",
                        example: false
                    },
                    message: {
                        type: "string",
                        example:
                            "Product not found"
                    }
                }
            },

            HealthResponse: {
                type: "object",
                properties: {
                    success: {
                        type: "boolean",
                        example: true
                    },
                    message: {
                        type: "string",
                        example:
                            "Product Service is healthy"
                    },
                    data: {
                        type: "object",
                        properties: {
                            service: {
                                type: "string",
                                example:
                                    "product-service"
                            },
                            status: {
                                type: "string",
                                example: "UP"
                            }
                        }
                    }
                }
            },

            Pagination: {
                type: "object",
                properties: {
                    limit: {
                        type: "integer",
                        example: 20
                    },
                    hasMore: {
                        type: "boolean",
                        example: true
                    },
                    nextCursor: {
                        type: "string",
                        nullable: true,
                        example:
                            "eyJjcmVhdGVkQXQiOiIyMDI2..."
                    }
                }
            }
        }
    },

    paths: {
        "/health": {
            get: {
                tags: ["Health"],
                summary: "Check service health",
                description:
                    "Returns the current health status of the Product Service.",
                responses: {
                    "200": {
                        description:
                            "Service is healthy",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref:
                                        "#/components/schemas/HealthResponse"
                                }
                            }
                        }
                    }
                }
            }
        },

        "/api/v1/categories": {
            post: {
                tags: ["Categories"],
                summary: "Create a category",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref:
                                    "#/components/schemas/CreateCategoryRequest"
                            }
                        }
                    }
                },
                responses: {
                    "201": {
                        description:
                            "Category created successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: {
                                            type: "boolean",
                                            example: true
                                        },
                                        message: {
                                            type: "string",
                                            example:
                                                "Category created successfully"
                                        },
                                        data: {
                                            $ref:
                                                "#/components/schemas/Category"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "400": {
                        description:
                            "Invalid request",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref:
                                        "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    },
                    "409": {
                        description:
                            "Category already exists",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref:
                                        "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    },
                    "500": {
                        description:
                            "Internal server error",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref:
                                        "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    }
                }
            },

            get: {
                tags: ["Categories"],
                summary: "Get all active categories",
                responses: {
                    "200": {
                        description:
                            "Categories fetched successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: {
                                            type: "boolean",
                                            example: true
                                        },
                                        message: {
                                            type: "string",
                                            example:
                                                "Categories fetched successfully"
                                        },
                                        data: {
                                            type: "array",
                                            items: {
                                                $ref:
                                                    "#/components/schemas/Category"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "500": {
                        description:
                            "Internal server error",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref:
                                        "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    }
                }
            }
        },

        "/api/v1/categories/{id}": {
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description:
                        "Category UUID",
                    schema: {
                        type: "string",
                        format: "uuid"
                    }
                }
            ],

            get: {
                tags: ["Categories"],
                summary: "Get category by ID",
                responses: {
                    "200": {
                        description:
                            "Category fetched successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: {
                                            type: "boolean",
                                            example: true
                                        },
                                        message: {
                                            type: "string",
                                            example:
                                                "Category fetched successfully"
                                        },
                                        data: {
                                            $ref:
                                                "#/components/schemas/Category"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "404": {
                        description:
                            "Category not found",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref:
                                        "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    },
                    "500": {
                        description:
                            "Internal server error",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref:
                                        "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    }
                }
            },

            put: {
                tags: ["Categories"],
                summary: "Update a category",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref:
                                    "#/components/schemas/UpdateCategoryRequest"
                            }
                        }
                    }
                },
                responses: {
                    "200": {
                        description:
                            "Category updated successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: {
                                            type: "boolean",
                                            example: true
                                        },
                                        message: {
                                            type: "string",
                                            example:
                                                "Category updated successfully"
                                        },
                                        data: {
                                            $ref:
                                                "#/components/schemas/Category"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "400": {
                        description:
                            "Invalid request",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref:
                                        "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    },
                    "404": {
                        description:
                            "Category not found",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref:
                                        "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    },
                    "409": {
                        description:
                            "Category conflict",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref:
                                        "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    }
                }
            },

            delete: {
                tags: ["Categories"],
                summary: "Delete a category",
                responses: {
                    "200": {
                        description:
                            "Category deleted successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: {
                                            type: "boolean",
                                            example: true
                                        },
                                        message: {
                                            type: "string",
                                            example:
                                                "Category deleted successfully"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "400": {
                        description:
                            "Invalid category ID",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref:
                                        "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    },
                    "404": {
                        description:
                            "Category not found",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref:
                                        "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    }
                }
            }
        },

        "/api/v1/products": {
            post: {
                tags: ["Products"],
                summary: "Create a product",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref:
                                    "#/components/schemas/CreateProductRequest"
                            }
                        }
                    }
                },
                responses: {
                    "201": {
                        description:
                            "Product created successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: {
                                            type: "boolean",
                                            example: true
                                        },
                                        message: {
                                            type: "string",
                                            example:
                                                "Product created successfully"
                                        },
                                        data: {
                                            $ref:
                                                "#/components/schemas/ProductWithCategories"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "400": {
                        description:
                            "Invalid product data",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref:
                                        "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    },
                    "404": {
                        description:
                            "Category not found",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref:
                                        "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    },
                    "409": {
                        description:
                            "SKU or slug already exists",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref:
                                        "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    }
                }
            },

            get: {
                tags: ["Products"],
                summary: "List products",
                description:
                    "Returns products using cursor-based pagination with optional category and search filters.",
                parameters: [
                    {
                        name: "cursor",
                        in: "query",
                        required: false,
                        description:
                            "Cursor returned from the previous response.",
                        schema: {
                            type: "string"
                        }
                    },
                    {
                        name: "limit",
                        in: "query",
                        required: false,
                        description:
                            "Number of products to return. Maximum 100.",
                        schema: {
                            type: "integer",
                            minimum: 1,
                            maximum: 100,
                            default: 20
                        }
                    },
                    {
                        name: "categoryId",
                        in: "query",
                        required: false,
                        description:
                            "Filter products by category UUID.",
                        schema: {
                            type: "string",
                            format: "uuid"
                        }
                    },
                    {
                        name: "search",
                        in: "query",
                        required: false,
                        description:
                            "Search products by name or relevant product fields.",
                        schema: {
                            type: "string"
                        }
                    },
                    {
                        name: "minPrice",
                        in: "query",
                        required: false,
                        description:
                            "Minimum product price.",
                        schema: {
                            type: "number",
                            minimum: 0
                        }
                    },
                    {
                        name: "maxPrice",
                        in: "query",
                        required: false,
                        description:
                            "Maximum product price.",
                        schema: {
                            type: "number",
                            minimum: 0
                        }
                    }
                ],
                responses: {
                    "200": {
                        description:
                            "Products fetched successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: {
                                            type: "boolean",
                                            example: true
                                        },
                                        data: {
                                            type: "array",
                                            items: {
                                                $ref:
                                                    "#/components/schemas/ProductWithCategories"
                                            }
                                        },
                                        pagination: {
                                            $ref:
                                                "#/components/schemas/Pagination"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "400": {
                        description:
                            "Invalid query parameters",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref:
                                        "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    }
                }
            }
        },

        "/api/v1/products/{id}": {
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description:
                        "Product UUID",
                    schema: {
                        type: "string",
                        format: "uuid"
                    }
                }
            ],

            get: {
                tags: ["Products"],
                summary: "Get product by ID",
                responses: {
                    "200": {
                        description:
                            "Product fetched successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: {
                                            type: "boolean",
                                            example: true
                                        },
                                        data: {
                                            $ref:
                                                "#/components/schemas/ProductWithCategories"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "404": {
                        description:
                            "Product not found",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref:
                                        "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    }
                }
            },

            put: {
                tags: ["Products"],
                summary: "Update a product",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref:
                                    "#/components/schemas/UpdateProductRequest"
                            }
                        }
                    }
                },
                responses: {
                    "200": {
                        description:
                            "Product updated successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: {
                                            type: "boolean",
                                            example: true
                                        },
                                        message: {
                                            type: "string",
                                            example:
                                                "Product updated successfully"
                                        },
                                        data: {
                                            $ref:
                                                "#/components/schemas/ProductWithCategories"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "400": {
                        description:
                            "Invalid product data",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref:
                                        "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    },
                    "404": {
                        description:
                            "Product not found",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref:
                                        "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    },
                    "409": {
                        description:
                            "SKU or slug conflict",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref:
                                        "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    }
                }
            },

            delete: {
                tags: ["Products"],
                summary: "Delete a product",
                responses: {
                    "200": {
                        description:
                            "Product deleted successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: {
                                            type: "boolean",
                                            example: true
                                        },
                                        message: {
                                            type: "string",
                                            example:
                                                "Product deleted successfully"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "400": {
                        description:
                            "Invalid product ID",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref:
                                        "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    },
                    "404": {
                        description:
                            "Product not found",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref:
                                        "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};

const swaggerOptions = {
    definition: swaggerDefinition,

    apis: []
};

export const swaggerSpec =
    swaggerJSDoc(swaggerOptions);