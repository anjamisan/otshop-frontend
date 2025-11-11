import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserProductDto } from '../models/user-product-dto';
import { PurchaseDto } from '../models/purchase-dto';

@Injectable({ providedIn: 'root' })
export class UserService {
  private baseUrl = 'http://localhost:8080/api/users';
  private favouritesUrl = 'http://localhost:8080/api/favourites';

  constructor(private http: HttpClient) { }



  // Buy a product
  buyProduct(dto: UserProductDto): Observable<string> {
    return this.http.post(`${this.baseUrl}/buy`, dto, { responseType: 'text' });
  }

  //  Add product to favourites
  addToFavourites(dto: UserProductDto): Observable<string> {
    return this.http.post(`${this.favouritesUrl}/add`, dto, { responseType: 'text' });
  }

  removeFromFavourites(dto: UserProductDto): Observable<string> {
    return this.http.delete(`${this.favouritesUrl}/remove`, {
      params: {
        userId: dto.userId.toString(),
        productId: dto.productId.toString()
      },
      responseType: 'text'
    });
  }

  getFavouritesById(id: number): Observable<UserProductDto[]> {
    return this.http.get<UserProductDto[]>(`${this.favouritesUrl}/${id}`);
  }

  isProductLiked(userId: number, productId: number): Observable<boolean> {
    return this.http.get<boolean>(
      `${this.favouritesUrl}/is-liked`,
      { params: { userId, productId } }
    );
  }

  getPurchasesById(id: number): Observable<PurchaseDto[]> {
    return this.http.get<PurchaseDto[]>(`${this.baseUrl}/${id}/purchases`);
  }

}
