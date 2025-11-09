import { Component, OnInit, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { AuthService } from './auth/service/auth.service';
import { CommonModule } from '@angular/common';
import { UserDTO } from './auth/models/user-dto';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginComponent, SignupComponent, RouterLink, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('otshop-frontend');
  isLoggedIn = false;
  isAdmin = false;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.isLoggedInObs$.subscribe(
      (status: boolean) => (this.isLoggedIn = status)
    );
    this.authService.currentUser$
      .pipe(filter((user): user is UserDTO => !!user)) // type-narrowing filter
      .subscribe(user => {
        this.isAdmin = !!user.admin;
      });
  }



  logout() {
    this.authService.logout();
  }
}
