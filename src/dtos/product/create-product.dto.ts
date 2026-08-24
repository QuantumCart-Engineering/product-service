export interface CreateProductDto {
    name: string;
    slug?: string;
    description?: string;
    price: number;
    sku: string;
    stockQuantity: number;
    categoryIds: string[];
}