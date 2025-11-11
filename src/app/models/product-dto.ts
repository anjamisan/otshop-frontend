export interface ProductDto {
    idProduct: number;
    productName: string;
    description?: string;
    condition: string;
    price: number;
    categoryName?: string;
    ageSexGroup?: string;
    imageUrls: string[];
    sold: boolean;
}