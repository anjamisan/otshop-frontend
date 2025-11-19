import { Injectable } from '@angular/core';
import { HttpClient, HttpBackend, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, EMPTY, filter, map, Observable, switchMap, tap, throwError } from 'rxjs';
import { UserDTO } from '../models/user-dto';
import { LoginRequestDTO } from '../models/log-req-dto';
import { AuthResponseDTO } from '../models/response-dto';
import { jwtDecode } from 'jwt-decode';
import { SignupDto } from '../models/signup-dto';

interface JwtPayload {
  exp: number; // Expiration timestamp (seconds)
  user?: Partial<UserDTO>;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authUrl = 'http://localhost:8080/api/auth';
  private readonly TOKEN_KEY = 'jwt_token';

  private currentUserSubject = new BehaviorSubject<UserDTO | null>(null);
  currentUser$ = this.currentUserSubject.asObservable(); //menjamo iz subjecta u observable kako druge komponente ne bi mogle da menjaju subject pozivom .next-a. observable to ne dozvoljava
  private httpWithoutInterceptor: HttpClient;

  constructor(
    private http: HttpClient,
    private httpBackend: HttpBackend
  ) {

    this.httpWithoutInterceptor = new HttpClient(this.httpBackend);

    this.loadUserState();
  }



  private decodeJwt(token: string): JwtPayload | null {
    try {
      const payload = jwtDecode<JwtPayload>(token);
      return payload;
    } catch (e) {
      // neispravan token
      console.error("Error decoding JWT:", e);
      return null;
    }
  }

  signup(registrationData: SignupDto): Observable<UserDTO> {
    return this.http.post<UserDTO>(`${this.authUrl}/signup`, registrationData)
      .pipe(
        tap((user: UserDTO) => {
          console.log(`Signup successful for ${user.username}`);
        })
      );
  }


  // --- LOGIN METHOD --- vraca UserDTO zato sto nakon primljenog tokena automatski pozivamo profile i menjamo tip observable-a koji se vraca
  login(credentials: LoginRequestDTO): Observable<UserDTO> {
    return this.http.post<AuthResponseDTO>(`${this.authUrl}/login`, credentials)
      .pipe(
        tap(response => {
          this.storeAuthData(response);
        }),
        // switchMap automatically replaces the previous observable with the next
        switchMap(() => this.profile() as Observable<UserDTO>),
        tap(user => {
          console.log("User profile loaded after login:", user);
        }),
        catchError((err: HttpErrorResponse) => {
          console.error("Login or profile fetch failed:", err);
          return throwError(() => err);
        })

      );
  }

  profile(): Observable<UserDTO> {
    const token = this.getAuthToken();

    if (!token) {
      console.warn('No token found when trying to fetch profile.');
      return EMPTY;
    }

    const headers = { Authorization: `Bearer ${token}` };

    return this.httpWithoutInterceptor.get<UserDTO>(`${this.authUrl}/profile`, { headers }).pipe(
      tap(user => {
        this.currentUserSubject.next(user);
      }),
      catchError(err => {
        if (err.status === 401 || err.status === 403) {
          console.warn('Unauthorized - token may be invalid or expired');
          this.logout();
        } else {
          console.error('Error fetching profile:', err);
        }
        return EMPTY;
      })
    );
  }

  // --- LOGOUT METHOD ---
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    // Push null to the stream to notify all subscribers
    this.currentUserSubject.next(null);
  }

  // --- TOKEN MANAGEMENT ---
  private storeAuthData(response: AuthResponseDTO): void {
    // 1. Store the JWT token
    localStorage.setItem(this.TOKEN_KEY, response.jwtToken);
  }

  getAuthToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private isTokenValid(exp: number): boolean {
    const now = Date.now() / 1000;
    return exp > (now + 5);
  }

  isLoggedIn(): boolean {
    return !!this.getAuthToken();
  }
  isLoggedInObs$ = this.currentUser$.pipe(map(user => user !== null));

  private loadUserState(): void {
    const token = this.getAuthToken();
    if (token) {
      const decoded = this.decodeJwt(token);
      if (decoded && this.isTokenValid(decoded.exp)) {

        this.profile().subscribe({
          next: user => console.log("Session restored for:", user.username),
          error: err => console.error("Failed to restore session:", err)
        });
      } else {
        console.warn("Token expired or invalid, logging out...");
        this.logout();
      }
    } else {
      this.currentUserSubject.next(null);
    }
  }
}
