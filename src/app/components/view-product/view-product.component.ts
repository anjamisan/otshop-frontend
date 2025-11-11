import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductDto } from '../../models/product-dto';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../../services/user.service';
import { ConditionLabelPipe } from '../../pipes/condition-label-pipe-pipe';
import { AdminService } from '../../services/admin.service';
import { UserDTO } from '../../auth/models/user-dto';
import { AuthService } from '../../auth/service/auth.service';
import { UserProductDto } from '../../models/user-product-dto';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-view-product',
  standalone: true,
  imports: [CommonModule, RouterLink, ConditionLabelPipe, RouterOutlet],
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.css']
})
export class ViewProductComponent implements OnInit {

  product: ProductDto | null = null;
  currentUser: UserDTO | null = null;
  isProductLiked = false;
  loading = true;
  errorMsg = '';

  currentImageIndex = 0;
  isZoomed = false;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private adminService: AdminService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const productId = Number(this.route.snapshot.paramMap.get('id'));

    // Stream of product loading
    const product$ = this.adminService.getProductById(productId);

    // Combine user + product
    combineLatest([this.authService.currentUser$, product$])
      .subscribe({
        next: ([user, product]) => {
          this.currentUser = user;
          this.product = product;
          this.loading = false;

          if (user && product) {
            this.checkIfProductLiked();
          }
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error loading product or user:', err);
          this.errorMsg = 'Failed to load product details.';
          this.loading = false;
        }
      });
  }

  loadProduct(productId: number): void {
    this.loading = true;
    this.adminService.getProductById(productId).subscribe({
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


  checkIfProductLiked(): void {
    if (!this.currentUser || !this.product) return;

    this.userService.isProductLiked(this.currentUser.idUser, this.product.idProduct)
      .subscribe({
        next: (liked: boolean) => {
          this.isProductLiked = liked;
          console.log(` Product liked: ${liked}`);
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error checking liked status:', err);
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


  buyProduct(): void {
    if (!this.product || !this.currentUser) {
      alert('Please log in first.');
      return;
    }
    const dto: UserProductDto = {
      userId: this.currentUser.idUser,
      productId: this.product.idProduct
    };

    this.userService.buyProduct(dto).subscribe({
      next: () => alert('Purchase successful!'),
      error: (err: HttpErrorResponse) => {
        console.error('Purchase failed:', err);
        alert('Purchase failed.');
      }
    });

    this.router.navigate(['/my-purchases']);
  }

  toggleFavourite(): void {
    if (!this.product || !this.currentUser) {
      alert('Please log in first.');
      return;
    }

    const dto: UserProductDto = {
      userId: this.currentUser.idUser,
      productId: this.product.idProduct
    };

    if (this.isProductLiked) {

      this.userService.removeFromFavourites(dto).subscribe({
        next: () => {
          this.isProductLiked = false;
          alert('Removed from favourites.');
        },
        error: (err: HttpErrorResponse) => {
          console.error('Failed to remove from favourites:', err);
          alert('Error removing from favourites.');
        }
      });
    } else {

      this.userService.addToFavourites(dto).subscribe({
        next: () => {
          this.isProductLiked = true;
          alert('Added to favourites!');
        },
        error: (err: HttpErrorResponse) => {
          console.error('Failed to add to favourites:', err);
          alert('Error adding to favourites.');
        }
      });
    }
  }

}
