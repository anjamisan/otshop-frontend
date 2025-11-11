import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AgesexDto } from '../models/agesex-dto';
import { CategoryDto } from '../models/category-dto';
import { AddCategoryDto } from '../models/add-category-dto';
import { AddProductDto } from '../models/add-product-dto';
import { ProductDto } from '../models/product-dto';
import { UserSummaryDto } from '../models/user-summary-dto';
import { PurchaseDto } from '../models/purchase-dto';


@Injectable({ providedIn: 'root' })
export class AdminService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  getAgeSex(): Observable<AgesexDto[]> {
    return this.http.get<AgesexDto[]>(`${this.baseUrl}/agesex`);
  }

  getCategoriesByAgeSex(ageSexId: number): Observable<CategoryDto[]> {
    return this.http.get<CategoryDto[]>(`${this.baseUrl}/agesex/${ageSexId}/categories`);
  }

  createProduct(payload: FormData): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/admin/products/create`, payload);
  }

  addCategory(dto: AddCategoryDto): Observable<string> {
    return this.http.post(`${this.baseUrl}/agesex/add-category`, dto, { responseType: 'text' });
  }

  //ovo mogu svi
  getAllProducts(): Observable<ProductDto[]> {
    return this.http.get<ProductDto[]>(`${this.baseUrl}/products/preview`);
  }


  //OVO MOZE I ZA ADMINA I ZA USERA
  getProductById(id: number): Observable<ProductDto> {
    return this.http.get<ProductDto>(`${this.baseUrl}/products/${id}`);
  }

  updateProduct(id: number, payload: { description: string; price: number }): Observable<ProductDto> {
    return this.http.put<ProductDto>(`${this.baseUrl}/products/${id}`, payload);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/products/${id}`);
  }

  getAllUsers(): Observable<UserSummaryDto[]> {
    return this.http.get<UserSummaryDto[]>(`${this.baseUrl}/admin/users`);
  }

  getUserPurchases(userId: number): Observable<PurchaseDto[]> {
    return this.http.get<PurchaseDto[]>(`${this.baseUrl}/users/${userId}/purchases`);
  }

  getPurchaseByProductId(productId: number): Observable<PurchaseDto> {
    return this.http.get<PurchaseDto>(`${this.baseUrl}/products/${productId}/purchase`);
  }

  getUserPurchaseReport(): Observable<Blob> {
    return this.http.get('http://localhost:8080/api/admin/reports/users-purchases', {
      responseType: 'blob'  // important for PDF
    });
  }

}


