import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductDto } from '../../../models/product-dto';
import { HttpErrorResponse } from '@angular/common/http';
import { AdminService } from '../../../services/admin.service';
import { ConditionLabelPipe } from '../../../pipes/condition-label-pipe-pipe';

@Component({
  selector: 'app-admin-product-detail',
  standalone: true,
  imports: [CommonModule, ConditionLabelPipe, RouterLink],
  templateUrl: './admin-product-detail.component.html',
  styleUrls: ['./admin-product-detail.component.css']
})
export class AdminProductDetailComponent implements OnInit {
  productId!: number;
  product: ProductDto | null = null;
  loading = true;
  errorMsg = '';

  // Slideshow & zoom logic
  currentImageIndex = 0;
  isZoomed = false;

  constructor(private route: ActivatedRoute, private api: AdminService) { }

  ngOnInit(): void {
    // Extract product ID from route
    this.productId = Number(this.route.snapshot.paramMap.get('id'));

    // Fetch product from backend
    this.api.getProductById(this.productId).subscribe({
      next: (data: ProductDto) => {
        this.product = data;
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error loading product:', err);
        this.errorMsg = 'Failed to load product details.';
        this.loading = false;
      }
    });
  }

  nextImage(): void {
    if (!this.product?.imageUrls) return;
    this.currentImageIndex = (this.currentImageIndex + 1) % this.product.imageUrls.length;
  }

  prevImage(): void {
    if (!this.product?.imageUrls) return;
    this.currentImageIndex =
      (this.currentImageIndex - 1 + this.product.imageUrls.length) % this.product.imageUrls.length;
  }

  setImage(index: number): void {
    this.currentImageIndex = index;
    this.isZoomed = false;
  }

  toggleZoom(): void {
    this.isZoomed = !this.isZoomed;
  }
}
