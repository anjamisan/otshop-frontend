import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../auth/service/auth.service';
import { UserService } from '../../services/user.service';
import { AdminService } from '../../services/admin.service';
import { UserDTO } from '../../auth/models/user-dto';
import { UserProductDto } from '../../models/user-product-dto';
import { ProductDto } from '../../models/product-dto';
import { forkJoin } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-my-favourites',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-favourites.component.html',
  styleUrls: ['./my-favourites.component.css']
})
export class MyFavouritesComponent implements OnInit {
  currentUser: UserDTO | null = null;
  favourites: ProductDto[] = [];
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
        this.loadFavourites(user.idUser);
      }
    });
  }

  loadFavourites(userId: number): void {
    this.loading = true;
    this.userService.getFavouritesById(userId).subscribe({
      next: (favouriteDtos: UserProductDto[]) => {
        if (favouriteDtos.length === 0) {
          this.loading = false;
          return;
        }

        console.log(favouriteDtos);
        const productRequests = favouriteDtos.map(fav =>
          this.adminService.getProductById(fav.productId)
        );

        forkJoin(productRequests).subscribe({
          next: (productList: ProductDto[]) => {
            this.favourites = productList;
            this.loading = false;
          },
          error: (err: HttpErrorResponse) => {
            console.error('Error loading favourite products:', err);
            this.errorMsg = 'Failed to load product details.';
            this.loading = false;
          }
        });
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error loading favourites:', err);
        this.errorMsg = 'Failed to load your favourites.';
        this.loading = false;
      }
    });
  }
}
