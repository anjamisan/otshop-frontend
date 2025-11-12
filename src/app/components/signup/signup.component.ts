
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Required for [(ngModel)]
import { CommonModule } from '@angular/common'; // Required for ngIf (optional, but good practice)
import { AuthService } from '../../auth/service/auth.service'; // Adjust path as needed
import { HttpErrorResponse } from '@angular/common/http';
import { SignupDto } from '../../auth/models/signup-dto';
import { UserDTO } from '../../auth/models/user-dto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  template: `
    <div class="signup-container">
      <h2>User Registration</h2>
      
      <label>Username:</label>
      <input [(ngModel)]="username" placeholder="Enter username" required>

      <label>Password:</label>
      <input [(ngModel)]="password" placeholder="Enter password" type="password" required>

      <label>Email:</label>
      <input [(ngModel)]="email" placeholder="Enter email" type="email" required>

      <button (click)="onSignup()">Register User</button>

      <p [ngStyle]="{color: message.startsWith('SUCCESS') ? 'green' : 'red'}">{{ message }}</p>
    </div>
  `,
  styleUrls: ['./signup.component.css'] // You'll define the toggle styles here
})
export class SignupComponent {
  // 1. Data Model
  username = '';
  password = '';
  email = '';
  //isAdmin = false; // Default: Regular user

  message = '';

  constructor(private authService: AuthService, private router: Router) { }

  onSignup() {
    this.message = 'Processing registration...';

    // 2. Prepare the DTO (We will create a separate RegistrationDTO structure)
    // NOTE: This assumes your Spring backend has a registration endpoint /register
    const newUser: SignupDto = {
      username: this.username,
      password: this.password,
      email: this.email,
    };


    this.authService.signup(newUser)
      .subscribe({
        next: (user: UserDTO) => {
          this.message = `Welcome ${user.username}. You can now log in!`;
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);


        },
        // 🔑 FIX 2: Explicitly define the error type
        error: (err: HttpErrorResponse) => {
          this.message = 'FAILURE: Registration failed. Status: ' + err.status;
          console.error('Registration Error:', err);
        }
      });


  }
}