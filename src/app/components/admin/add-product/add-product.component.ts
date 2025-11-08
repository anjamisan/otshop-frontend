import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgesexDto } from '../../../models/agesex-dto';
import { HttpErrorResponse } from '@angular/common/http';
import { CategoryDto } from '../../../models/category-dto';
import { AddProductDto } from '../../../models/add-product-dto';
import { FilePreviewPipe } from '../../../pipes/file-preview-pipe';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule, FilePreviewPipe, RouterLink],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  // form fields
  productName = '';
  description = '';
  condition: AddProductDto['condition'] | '' = '';
  price: number | null = null;
  selectedAgeSexId: number | null = null;
  selectedCategoryId: number | null = null;
  selectedFiles: File[] = [];

  // data
  ageSexList: AgesexDto[] = [];
  categoriesForSelected: CategoryDto[] = [];

  // UI state
  loadingAgeSex = false;
  loadingCategories = false;
  submitting = false;
  errorMsg = '';
  successMsg = '';

  readonly conditions = [
    { value: 'NEW_WITH_TAGS', label: 'New with tags' },
    { value: 'NEW_WITHOUT_TAGS', label: 'New without tags' },
    { value: 'VERY_GOOD', label: 'Very good' },
    { value: 'GOOD', label: 'Good' },
    { value: 'SATISFACTORY', label: 'Satisfactory' }
  ] as const;

  constructor(private api: AdminService) { }

  ngOnInit(): void {
    this.fetchAgeSex();
  }

  private fetchAgeSex(): void {
    this.loadingAgeSex = true;
    this.api.getAgeSex().subscribe({
      next: (data: AgesexDto[]) => { this.ageSexList = data; },
      error: (err: HttpErrorResponse) => { this.errorMsg = 'Failed to load Age/Sex options.'; console.error(err); },
      complete: () => { this.loadingAgeSex = false; }
    });
  }

  onFileSelected(event: any): void {
    this.selectedFiles = Array.from(event.target.files);
  }

  onAgeSexChange(): void {
    this.selectedCategoryId = null;
    this.categoriesForSelected = [];
    if (this.selectedAgeSexId == null) { console.log("selected agesex id is null"); return; }

    this.loadingCategories = true;
    this.api.getCategoriesByAgeSex(this.selectedAgeSexId).subscribe({
      next: (data: CategoryDto[]) => { this.categoriesForSelected = data; console.log("Kategorije: ", data); },
      error: (err: HttpErrorResponse) => { this.errorMsg = 'Failed to load categories for selected Age/Sex.'; console.error(err); },
      complete: () => { this.loadingCategories = false; }
    });
  }

  onSubmit(): void {
    this.errorMsg = '';
    this.successMsg = '';

    if (!this.productName || !this.condition || this.price == null || this.price < 0 ||
      this.selectedAgeSexId == null || this.selectedCategoryId == null) {
      this.errorMsg = 'Please fill in all required fields.';
      return;
    }

    const formData = new FormData();
    formData.append('productName', this.productName);
    formData.append('description', this.description);
    formData.append('condition', this.condition);
    formData.append('price', this.price.toString());
    formData.append('ageSexId', this.selectedAgeSexId.toString());
    formData.append('categoryId', this.selectedCategoryId.toString());

    for (const file of this.selectedFiles) {
      formData.append('images', file);
    }

    this.submitting = true;
    this.api.createProduct(formData).subscribe({
      next: () => {
        this.successMsg = '✅ Product added successfully!';
        this.resetForm();
      },
      error: (err: HttpErrorResponse) => {
        this.errorMsg = '❌ Failed to add product.';
        console.error(err);
      },
      complete: () => { this.submitting = false; }
    });
  }

  private resetForm(): void {
    this.productName = '';
    this.description = '';
    this.condition = '';
    this.price = null;
    this.selectedAgeSexId = null;
    this.selectedCategoryId = null;
    this.categoriesForSelected = [];
  }
}
