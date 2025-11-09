import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ProductDto } from '../../../models/product-dto';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-admin-view-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-view-products.component.html',
  styleUrls: ['./admin-view-products.component.css']
})
export class AdminViewProductsComponent implements OnInit {

  products: ProductDto[] = [];
  loading = false;
  errorMsg = '';

  constructor(private api: AdminService, private router: Router) { }

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.loading = true;
    this.api.getAllProducts().subscribe({
      next: (data: ProductDto[]) => {
        this.products = data;
        console.log("Products loaded:", data);
      },
      error: (err: HttpErrorResponse) => {
        this.errorMsg = 'Failed to load products';
        console.error('Failed to load products', err);
      },
      complete: () => (this.loading = false)
    });
  }

  viewProduct(productId: number): void {
    this.router.navigate(['/admin/product', productId]);
  }
}
