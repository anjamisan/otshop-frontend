import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, EMPTY, filter, Observable, switchMap, tap } from 'rxjs';
import { UserDTO } from '../models/user-dto';
import { LoginRequestDTO } from '../models/log-req-dto';
import { AuthResponseDTO } from '../models/response-dto';
import { jwtDecode } from 'jwt-decode';
import { SignupDto } from '../models/signup-dto';

// Usage: jwt_decode(token); 
// OR sometimes: jwt_decode.default(token); (Less likely with modern Angular)

// Define the expected structure of the token payload for strong typing
interface JwtPayload {
  exp: number; // Expiration timestamp (seconds)
  user?: Partial<UserDTO>; // User data, may be missing
  // Add other claims like 'iat', 'sub', 'roles', etc. if present
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Base URL for the Spring Auth Controller
  private authUrl = 'http://localhost:8080/api/auth'; //NAMESTI DA BUDE OVO
  private readonly TOKEN_KEY = 'jwt_token';

  private currentUserSubject = new BehaviorSubject<UserDTO | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();


  constructor(private http: HttpClient) {
    // Load initial state on app start
    this.loadUserState();
  }

  private decodeJwt(token: string): JwtPayload | null {
    try {
      // The library handles splitting, Base64 decoding, and JSON parsing securely
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
          console.log(`✅ Signup successful for ${user.username}`);
        })
      );
  }


  // --- LOGIN METHOD --- vraca UserDTO zato sto nakon primljenog tokena automatski pozivamo profile i menjamo tip observable-a koji se vraca
  login(credentials: LoginRequestDTO): Observable<UserDTO> {
    return this.http.post<AuthResponseDTO>(`${this.authUrl}/login`, credentials)
      .pipe(
        tap(response => {
          this.storeAuthData(response);
          // Push the new user to the stream
          //this.currentUserSubject.next(response.user);
        }),
        // switchMap automatically replaces the previous observable with the next
        switchMap(() => this.profile() as Observable<UserDTO>),
        tap(user => {
          console.log("✅ User profile loaded after login:", user);
        }),
        catchError((err: HttpErrorResponse) => {
          console.error("❌ Login or profile fetch failed:", err);
          return EMPTY;
        })

      );
  }

  profile(): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.authUrl}/profile`).pipe(
      tap(user => {
        //apdejtuj trenutnog usera
        this.currentUserSubject.next(user);
      }),
      catchError(err => {
        if (err.status === 401 || err.status === 403) {
          console.warn("⚠️ Unauthorized - token may be invalid or expired");
          this.logout();
        } else {
          console.error("❌ Error fetching profile:", err);
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
    // Allow a 5-second buffer for clock skew
    return exp > (now + 5);
  }

  isLoggedIn(): boolean {
    // Check if the token exists (and maybe check its expiration time)
    return !!this.getAuthToken();
  }

  private loadUserState(): void {
    const token = this.getAuthToken();
    if (token) {
      const decoded = this.decodeJwt(token);
      if (decoded && this.isTokenValid(decoded.exp)) {
        // ✅ Fetch profile from backend to restore session
        this.profile().subscribe({
          next: user => console.log("✅ Session restored for:", user.username),
          error: err => console.error("❌ Failed to restore session:", err)
        });
      } else {
        console.warn("⚠️ Token expired or invalid, logging out...");
        this.logout();
      }
    } else {
      this.currentUserSubject.next(null);
    }
  }
}
