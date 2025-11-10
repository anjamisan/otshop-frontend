import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserSummaryDto } from '../../../models/user-summary-dto';
import { HttpErrorResponse } from '@angular/common/http';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-admin-user-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-user-list.component.html',
  styleUrls: ['./admin-user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: UserSummaryDto[] = [];
  errorMsg = '';
  loading = false;

  constructor(private api: AdminService) { }

  ngOnInit(): void {
    this.loading = true;
    this.api.getAllUsers().subscribe({
      next: (data: UserSummaryDto[]) => { this.users = data; },
      error: (err: HttpErrorResponse) => {
        this.errorMsg = 'Failed to load users';
        console.error(err);
      },
      complete: () => { this.loading = false; }
    });
  }
}
