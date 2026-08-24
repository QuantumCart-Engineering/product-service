export interface UpdateProductDto {
    name?: string;
    slug?: string;
    description?: string;
    price?: number;
    sku?: string;
    stockQuantity?: number;
    categoryIds?: string[];
}