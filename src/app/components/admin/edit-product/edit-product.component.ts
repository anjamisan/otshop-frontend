import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductDto } from '../../../models/product-dto';
import { HttpErrorResponse } from '@angular/common/http';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-admin-product-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {
  product?: ProductDto;
  errorMsg = '';
  confirmDelete = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: AdminService
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.api.getProductById(id).subscribe({
      next: (data) => (this.product = data),
      error: (err: HttpErrorResponse) => {
        this.errorMsg = 'Failed to load product details.';
        console.error(err);
      }
    });
  }

  onSave(): void {
    if (!this.product) return;

    const payload = {
      description: this.product.description ?? '',
      price: this.product.price
    };

    this.api.updateProduct(this.product.idProduct, payload).subscribe({
      next: (updated) => {
        alert('Product updated successfully!');
        this.router.navigate(['/admin/product', updated.idProduct]);
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        alert('Failed to update product.');
      }
    });
  }

  onDelete(): void {
    if (!this.product) return;
    this.confirmDelete = true;
  }

  confirmDeletion(confirm: boolean): void {
    if (confirm && this.product) {
      this.api.deleteProduct(this.product.idProduct).subscribe({
        next: () => {
          alert('Product deleted successfully.');
          this.router.navigate(['/admin']);
        },
        error: (err) => {
          console.error(err);
          alert('Failed to delete product.');
        }
      });
    }
    this.confirmDelete = false;
  }
}
