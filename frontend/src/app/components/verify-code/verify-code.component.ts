// src/app/components/verify-code/verify-code.component.ts
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-verify-code',
  templateUrl: './verify-code.component.html',
  styleUrls: ['./verify-code.component.css']
})
export class VerifyCodeComponent {
  code = '';
  email = sessionStorage.getItem('pendingEmail') || ''; // stocké après register
  error = '';
  success = '';
  showResend = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || sessionStorage.getItem('pendingEmail') || '';
      console.log('📩 Email utilisé pour vérification :', this.email);
    });
  }
  loadingVerify = false;
  loadingResend = false;

  onVerify() {
    if (!this.code || this.code.trim().length !== 6) {
      this.error = '❌ Le code doit contenir 6 chiffres.';
      this.showResend = true;
      return;
    }

    this.loadingVerify = true;

    this.http.post('http://localhost:8081/PIdev/auth/verify-code', {
      email: this.email,
      code: this.code.trim()
    }, { responseType: 'text' }).subscribe({
      next: () => {
        this.success = '✔️ Vérification réussie. Redirection...';
        this.error = '';
        this.loadingVerify = false;
        sessionStorage.removeItem('pendingEmail');
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        this.error = err?.error || '❌ Code invalide ou expiré.';
        this.success = '';
        this.loadingVerify = false;
        this.showResend = true;
      }
    });
  }

  resendCode() {
    this.loadingResend = true;

    this.http.post('http://localhost:8081/PIdev/auth/resend-code', { email: this.email }).subscribe({
      next: () => {
        this.success = '📩 Nouveau code envoyé par mail.';
        this.error = '';
        this.loadingResend = false;
      },
      error: () => {
        this.error = '❌ Échec d’envoi. Vérifie ton email.';
        this.success = '';
        this.loadingResend = false;
      }
    });
  }


}
