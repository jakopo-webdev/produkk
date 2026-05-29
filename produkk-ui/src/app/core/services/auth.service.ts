import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { User, AuthResponse, MessageResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'access_token';
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  readonly currentUser = signal<User | null>(null);

  register(username: string, password: string) {
    return this.http.post<MessageResponse>('/auth/register', { username, password });
  }

  login(username: string, password: string) {
    return this.http.post<AuthResponse>('/auth/login', { username, password }).pipe(
      tap((res) => localStorage.setItem(this.TOKEN_KEY, res.access_token)),
    );
  }

  getProfile() {
    return this.http.get<User>('/auth/profile').pipe(
      tap((user) => this.currentUser.set(user)),
    );
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
