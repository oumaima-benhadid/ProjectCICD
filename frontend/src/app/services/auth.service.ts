// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable  } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8081/PIdev/auth';
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient,
     private router: Router ,
  ) {}
  private hasToken(): boolean {
    return !!sessionStorage.getItem('token');
  }
  login(credentials: { email: string; password: string }) {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  saveSession(token: string, role: string): void {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('role', role);
    this.isLoggedInSubject.next(true);
    console.log('🧪 Token payload:', this.getDecodedToken());

  }
  getUserId(): string | null {
    const token = this.getToken();
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub;
  }
  getCurrentUserEmail(): string | null {
    const token = sessionStorage.getItem('token');
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub; // c'est l'email
  }
  getCurrentUser() {
    const token = sessionStorage.getItem('token');
    return this.http.get('http://localhost:8081/PIdev/user/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
  }


  getCurrentUserId(): string | null {
    const tokenPayload = this.getDecodedToken();
    return tokenPayload?.id ?? null;
  }

  getDecodedToken(): any {
    const token = sessionStorage.getItem('token');
    if (!token) return null;
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  }
  getCurrentUserRole() {
    const token = sessionStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role;
    }
    return null;
  }
  getToken(): string | null {
    return sessionStorage.getItem('token');
  }


  getRole(): string | null {
    return sessionStorage.getItem('role');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return this.getRole() === 'ADMIN';
  }
  isNutritionniste(): boolean {
    return this.getRole() === 'NUTRITIONNISTE'; }

  register(payload: any) {
    return this.http.post('http://localhost:8081/auth/registration', payload);
  }

  isEtudiant(): boolean {
    return this.getRole() === 'ETUDIANT';
  }

  logout(): void {
    sessionStorage.clear();
    this.isLoggedInSubject.next(false);
    this.router.navigate(['/login']);
  }
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
  getCurrentUserFromApi(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get<any>('http://localhost:8081/PIdev/user/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  getCurrentUserIdFromToken(): number | null {
    const token = sessionStorage.getItem('token');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id ?? null;
    } catch (error) {
      console.error('Erreur de décodage du token', error);
      return null;
    }
  }

}
