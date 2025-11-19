
import { AsyncPipe, CommonModule, NgIf } from '@angular/common';
import { AuthService } from './auth/service/auth.service';
import { UserDTO } from './auth/models/user-dto';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Component } from '@angular/core';
import { UserCardComponent } from './components/profile-card/profile-card.component';
import { map } from 'rxjs';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    CommonModule,
    UserCardComponent,
    NgIf,
    AsyncPipe
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  currentUser$;
  title = 'otshop-frontend';

  constructor(private authService: AuthService) { this.currentUser$ = this.authService.currentUser$; }

  // isAdmin() {
  //   return this.currentUser$.pipe(
  //     map((user: UserDTO | null) => !!user?.admin)
  //   );
  // }
  onLogout() {
    this.authService.logout();
  }
}
