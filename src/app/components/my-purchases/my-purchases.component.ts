import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/service/auth.service';
import { UserDTO } from '../../auth/models/user-dto';
import { UserService } from '../../services/user.service';
import { AdminService } from '../../services/admin.service';
import { PurchaseDto } from '../../models/purchase-dto';
import { ProductDto } from '../../models/product-dto';
import { forkJoin } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-my-purchases',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-purchases.component.html',
  styleUrls: ['./my-purchases.component.css']
})
export class MyPurchasesComponent implements OnInit {
  currentUser: UserDTO | null = null;
  purchases: { purchase: PurchaseDto; product: ProductDto }[] = [];
  loading = false;
  errorMsg = '';

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private adminService: AdminService
  ) { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.currentUser = user;
        this.loadPurchases(user.idUser);
      }
    });
  }

  loadPurchases(userId: number): void {
    this.loading = true;
    this.userService.getPurchasesById(userId).subscribe({
      next: (purchaseList: PurchaseDto[]) => {
        if (purchaseList.length === 0) {
          this.loading = false;
          return;
        }

        // Fetch product details for each purchase
        const productRequests = purchaseList.map(p =>
          this.adminService.getProductById(p.productId)
        );

        forkJoin(productRequests).subscribe({
          next: (productList: ProductDto[]) => {
            this.purchases = purchaseList.map((purchase, i) => ({
              purchase,
              product: productList[i]
            }));
            this.loading = false;
          },
          error: (err: HttpErrorResponse) => {
            console.error('Error loading products for purchases', err);
            this.errorMsg = 'Failed to load product details for purchases.';
            this.loading = false;
          }
        });
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error loading purchases', err);
        this.errorMsg = 'Failed to load your purchases.';
        this.loading = false;
      }
    });
  }
}
