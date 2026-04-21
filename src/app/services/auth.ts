import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

// What a login response looks like from Django
interface TokenResponse {
  access: string;
  refresh: string;
}

// What's INSIDE the decoded access token (the claims we added in Django!)
interface TokenPayload {
  user_id: number;
  username: string;
  role: 'customer' | 'master' | 'manager';
  exp: number;
  iat: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://localhost:8000/api';

  // Signals let components reactively know when login state changes
  currentUser = signal<TokenPayload | null>(null);

  constructor(private http: HttpClient, private router: Router) {
    // On app startup, check if there's already a token in localStorage
    this.loadUserFromStorage();
  }

  // LOGIN — sends credentials to Django, receives tokens, stores them
  login(username: string, password: string): Observable<TokenResponse> {
    return this.http
      .post<TokenResponse>(`${this.baseUrl}/token/`, { username, password })
      .pipe(
        tap((tokens) => {
          // Save both tokens
          localStorage.setItem('access_token', tokens.access);
          localStorage.setItem('refresh_token', tokens.refresh);
          // Decode the access token and save the user info
          const payload = jwtDecode<TokenPayload>(tokens.access);
          this.currentUser.set(payload);
        })
      );
  }

  // LOGOUT — clear tokens and go back to home
  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  // Read token from localStorage (for the interceptor to attach to requests)
  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  // Is there a valid, non-expired token?
  isLoggedIn(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;
    try {
      const payload = jwtDecode<TokenPayload>(token);
      // exp is in seconds since epoch, Date.now() is in milliseconds
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  // Quick role checks for templates/guards
  getRole(): string | null {
    return this.currentUser()?.role ?? null;
  }

  isManager(): boolean {
    return this.getRole() === 'manager';
  }

  isMaster(): boolean {
    return this.getRole() === 'master';
  }

  // Called on startup — rebuild the currentUser signal from localStorage
  private loadUserFromStorage(): void {
    const token = this.getAccessToken();
    if (!token) return;
    try {
      const payload = jwtDecode<TokenPayload>(token);
      if (payload.exp * 1000 > Date.now()) {
        this.currentUser.set(payload);
      } else {
        // Token expired, clear it
        this.logout();
      }
    } catch {
      this.logout();
    }
  }
}   