import { Component } from '@angular/core';
import { AuthService } from '../../auth/service/auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserDTO } from '../../auth/models/user-dto';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true, // You are using standalone components
  imports: [
    FormsModule // 🔑 Add FormsModule to the imports array
  ],
  template: `
    <input [(ngModel)]="username" placeholder="Username/Email">
    <input [(ngModel)]="password" placeholder="Password" type="password">
    <button (click)="onLogin()">Login</button>
    <p style="color:red">{{ message }}</p>
  `
})
export class LoginComponent {
  username = '';
  password = '';
  message = '';
  messageColor = 'black';

  constructor(private authService: AuthService, private router: Router) { }
  onLogin() {
    this.message = 'Attempting login...';
    this.messageColor = 'black';

    this.authService.login({ username: this.username, password: this.password })
      .subscribe({
        next: (user: UserDTO) => {
          // Uspesan login
          this.message = `Welcome, ${user.username}! Redirecting...`;
          this.messageColor = 'green';


          // kratko odlaganje redirekcije da bi se procitala poruka
          setTimeout(() => {
            if (user.admin) {
              console.log("Admin true: ", user.admin);
              console.log("Email: ", user.email);
              console.log("name: ", user.username);

              console.log("pass: ", user.idUser);

              this.router.navigate(['/admin']);
            } else {
              console.log("Admin false: ", user.admin);
              console.log("Email: ", user.email);
              console.log("name: ", user.username);

              console.log("pass: ", user.idUser);


              this.router.navigate(['/home']);
            }
          }, 5000);
        },
        error: (err: HttpErrorResponse) => {
          // greska
          if (err.status === 401) {
            this.message = 'Invalid username or password. Please try again.';
          } else {
            this.message = 'Login failed. Please check your connection.';
          }
          this.messageColor = 'red';
          console.error('Login Error:', err);

          // Reset form
          this.username = '';
          this.password = '';
        }
      });
  }
}
