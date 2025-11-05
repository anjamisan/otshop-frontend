import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HelloMessage } from '../models/hello-message';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/test';

  constructor(private http: HttpClient) { }

  getHelloMessage(): Observable<HelloMessage> {
    // HttpClient.get() returns an Observable
    return this.http.get<HelloMessage>(this.apiUrl);
  }
}
