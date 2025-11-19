import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDTO } from '../../auth/models/user-dto';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dropdown-container">

      <!-- BUTTON (when card is collapsed) -->
      <button class="profile-btn" (click)="toggleDropdown()">
        {{ user?.username }}
        <span class="arrow">{{ isOpen ? '▲' : '▼' }}</span>
      </button>

      <!-- DROPDOWN CARD -->
      <div class="user-card" *ngIf="isOpen">
        <p><strong>{{ user?.username }}</strong></p>
        <p>{{ user?.email }}</p>
        <p>{{ user?.admin ? 'Admin' : 'User' }}</p>
        <button class="logout-btn" (click)="logout.emit()">Logout</button>
      </div>

    </div>
  `,
  styleUrl: './profile-card.component.css'
})
export class UserCardComponent {
  @Input() user: UserDTO | null = null;
  @Output() logout = new EventEmitter<void>();

  isOpen = false;

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

}
