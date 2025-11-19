
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';

import { AgesexDto } from '../../../models/agesex-dto';
import { AdminService } from '../../../services/admin.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AddCategoryDto } from '../../../models/add-category-dto';

@Component({
  selector: 'app-add-category',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent implements OnInit {
  agesexList: AgesexDto[] = [];
  //definisanje varijablu koja pokazuje na formgroup
  categoryForm!: FormGroup;


  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    //pravljenje forme
    this.categoryForm = new FormGroup({
      'agesexId': new FormControl(null, [Validators.required]),
      'categoryName': new FormControl('', [Validators.required])
    });

    this.adminService.getAgeSex().subscribe({
      next: (data: AgesexDto[]) => (this.agesexList = data),
      error: (err: HttpErrorResponse) => console.error('Failed to load Agesex data', err)
    });
  }


  get agesexId() {
    return this.categoryForm.get('agesexId');
  }

  get categoryNameControl() {
    return this.categoryForm.get('categoryName');
  }


  onSubmit(): void {
    if (this.categoryForm.invalid) {
      alert('Please select an Age/Sex group and enter a category name.');
      return;
    }

    const formValues = this.categoryForm.value;

    const newCategory: AddCategoryDto = {
      categoryName: formValues.categoryName.trim(),
      agesexId: formValues.agesexId
    };

    this.adminService.addCategory(newCategory).subscribe({
      next: () => {
        alert('Category added successfully!');
        this.categoryForm.reset();
        this.categoryForm.get('agesexId')?.setValue(null);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error adding category:', err);
        alert('Failed to add category.');
      }
    });
  }
}