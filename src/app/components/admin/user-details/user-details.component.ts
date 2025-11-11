import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

import { UserSummaryDto } from '../../../models/user-summary-dto';
import { PurchaseDto } from '../../../models/purchase-dto';
import { HttpErrorResponse } from '@angular/common/http';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-admin-user-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
  userId!: number;
  user?: UserSummaryDto;
  purchases: PurchaseDto[] = [];
  errorMsg = '';
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private api: AdminService
  ) { }

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadUserData();
    this.loadUserPurchases();
  }

  loadUserData(): void {
    // You already have all users in summary API — optionally reuse that
    this.api.getAllUsers().subscribe(users => {
      this.user = users.find(u => u.idUser === this.userId);
    });
  }

  loadUserPurchases(): void {
    this.loading = true;
    this.api.getUserPurchases(this.userId).subscribe({
      next: (data) => { this.purchases = data; },
      error: (err: HttpErrorResponse) => {
        this.errorMsg = 'Failed to load user purchases';
        console.error(err);
      },
      complete: () => { this.loading = false; }
    });
  }
}
