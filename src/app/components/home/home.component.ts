import { Component, OnInit } from '@angular/core';
import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { ProductDto } from '../../models/product-dto';
import { AdminService } from '../../services/admin.service';
import { AuthService } from '../../auth/service/auth.service';
import { ConditionLabelPipe } from '../../pipes/condition-label-pipe-pipe';
import { FormsModule } from '@angular/forms';
import { AgesexDto } from '../../models/agesex-dto';
import { CategoryDto } from '../../models/category-dto';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ConditionLabelPipe, NgIf, NgForOf],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  products: ProductDto[] = [];
  filteredProducts: ProductDto[] = [];

  loading = false;
  errorMsg = '';
  isLoggedIn = false;

  // Dropdowns
  agesexList: AgesexDto[] = [];
  categoryList: CategoryDto[] = [];
  conditionList = [
    { value: 'NEW_WITH_TAGS', label: 'New with tags' },
    { value: 'NEW_WITHOUT_TAGS', label: 'New without tags' },
    { value: 'VERY_GOOD', label: 'Very good' },
    { value: 'GOOD', label: 'Good' },
    { value: 'SATISFACTORY', label: 'Satisfactory' }
  ];

  // Selected filters
  selectedAgeSexGroup: string | null = null;
  selectedCategoryName: string | null = null;
  selectedCondition: string | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private api: AdminService,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.fetchProducts();
    this.fetchAgeSex();
  }

  fetchProducts(): void {
    this.loading = true;
    this.api.getAllProducts().subscribe({
      next: (data: ProductDto[]) => {
        this.products = data;
        this.filteredProducts = [...data];
      },
      error: (err: HttpErrorResponse) => {
        this.errorMsg = 'Failed to load products';
        console.error('Failed to load products', err);
      },
      complete: () => (this.loading = false)
    });
  }

  fetchAgeSex(): void {
    this.api.getAgeSex().subscribe({
      next: (data: AgesexDto[]) => (this.agesexList = data),
      error: (err: HttpErrorResponse) => console.error('Failed to fetch agesex', err)
    });
  }

  onAgeSexChange(): void {
    if (this.selectedAgeSexGroup) {
      const selectedAgesex = this.agesexList.find(a => a.ageSexGroup === this.selectedAgeSexGroup);
      if (selectedAgesex) {
        this.api.getCategoriesByAgeSex(selectedAgesex.idAgeSex).subscribe({
          next: (data: CategoryDto[]) => (this.categoryList = data),
          error: (err: HttpErrorResponse) => console.error('Failed to fetch categories', err)
        });
      }
    } else {
      this.categoryList = [];
      this.selectedCategoryName = null;
    }
    this.applyFilters();
  }

  onCategoryChange(): void {
    this.applyFilters();
  }

  onConditionChange(): void {
    this.applyFilters();
  }

  onSortChange(): void {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredProducts = this.products.filter(p => {
      const matchesAgeSex = !this.selectedAgeSexGroup || p.ageSexGroup === this.selectedAgeSexGroup;
      const matchesCategory = !this.selectedCategoryName || p.categoryName === this.selectedCategoryName;
      const matchesCondition = !this.selectedCondition || p.condition === this.selectedCondition;
      return matchesAgeSex && matchesCategory && matchesCondition;
    });

    this.filteredProducts.sort((a, b) =>
      this.sortDirection === 'asc' ? a.price - b.price : b.price - a.price
    );
  }

  viewProduct(productId: number): void {
    if (!this.isLoggedIn) return;
    this.router.navigate(['/products', productId]);
  }
}
