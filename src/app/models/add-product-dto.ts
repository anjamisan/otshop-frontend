export interface AddProductDto {
    productName: string;
    description?: string;
    condition: 'NEW_WITH_TAGS' | 'NEW_WITHOUT_TAGS' | 'VERY_GOOD' | 'GOOD' | 'SATISFACTORY';
    price: number;
    ageSexId: number;
    categoryId: number;
    images?: File[];
}
