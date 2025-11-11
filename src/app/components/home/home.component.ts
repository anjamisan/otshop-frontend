import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { ProductDto } from '../../models/product-dto';
import { AdminService } from '../../services/admin.service';
import { AuthService } from '../../auth/service/auth.service';
import { ConditionLabelPipe } from '../../pipes/condition-label-pipe-pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ConditionLabelPipe],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  products: ProductDto[] = [];
  loading = false;
  errorMsg = '';
  isLoggedIn = false;

  constructor(
    private api: AdminService,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // check login status
    this.isLoggedIn = this.authService.isLoggedIn();

    // fetch all products
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.loading = true;
    this.api.getAllProducts().subscribe({
      next: (data: ProductDto[]) => {
        this.products = data;
        console.log('Products loaded:', data);
      },
      error: (err: HttpErrorResponse) => {
        this.errorMsg = 'Failed to load products';
        console.error('Failed to load products', err);
      },
      complete: () => (this.loading = false)
    });
  }

  viewProduct(productId: number): void {
    if (!this.isLoggedIn) return;
    this.router.navigate(['/product', productId]);
  }
}
