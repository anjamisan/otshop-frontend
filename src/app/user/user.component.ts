import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user',
  imports: [],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {

  message: string = 'Loading...';

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    // Subscribe to the Observable returned by the service
    this.userService.getHelloMessage().subscribe({
      next: (data) => {
        // Assuming your Spring Boot controller returns an object with a 'content' field
        this.message = data.content;
      },
      error: (err) => {
        console.error('API Error:', err);
        this.message = 'Error fetching data from backend.';
      }
    });
  }

}
