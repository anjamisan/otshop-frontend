import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AgesexDto } from '../../../models/agesex-dto';
import { AdminService } from '../../../services/admin.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AddCategoryDto } from '../../../models/add-category-dto';

@Component({
  selector: 'app-add-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent implements OnInit {
  agesexList: AgesexDto[] = [];
  selectedAgesexId: number | null = null;
  categoryName: string = '';

  constructor(
    private adminService: AdminService
  ) { }

  ngOnInit(): void {
    this.adminService.getAgeSex().subscribe({
      next: (data: AgesexDto[]) => (this.agesexList = data),
      error: (err: HttpErrorResponse) => console.error('Failed to load Agesex data', err)
    });
  }

  onSubmit(): void {
    if (!this.selectedAgesexId || !this.categoryName.trim()) {
      alert('Please select an Age/Sex group and enter a category name.');
      return;
    }

    const newCategory: AddCategoryDto = {
      categoryName: this.categoryName.trim(),
      agesexId: this.selectedAgesexId
    };

    // call service method (you'll define this)
    this.adminService.addCategory(newCategory).subscribe({
      next: () => {
        alert('Category added successfully!');
        this.categoryName = '';
        this.selectedAgesexId = null;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error adding category:', err);
        alert('Failed to add category.');
      }
    });
  }
}
