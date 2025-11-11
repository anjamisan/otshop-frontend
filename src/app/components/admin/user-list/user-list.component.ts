import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserSummaryDto } from '../../../models/user-summary-dto';
import { HttpErrorResponse } from '@angular/common/http';
import { AdminService } from '../../../services/admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-user-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: UserSummaryDto[] = [];
  errorMsg = '';
  loading = false;

  constructor(private api: AdminService, private router: Router) { }

  ngOnInit(): void {
    this.loading = true;
    this.api.getAllUsers().subscribe({
      next: (data: UserSummaryDto[]) => { this.users = data.filter(u => !u.admin); },
      error: (err: HttpErrorResponse) => {
        this.errorMsg = 'Failed to load users';
        console.error(err);
      },
      complete: () => { this.loading = false; }
    });
  }

  goToUser(id: number) {
    this.router.navigate(['/admin/users', id]); //sam ce sklopiti id
  }
}
