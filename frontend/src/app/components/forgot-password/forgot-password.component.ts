import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  email: string = '';
  successMsg: string = '';
  errorMsg: string = '';

  constructor(private http: HttpClient) {}

  loading: boolean = false;

onSubmit() {
  this.loading = true;

  const payload = { email: this.email };

  this.http.post('http://localhost:8081/PIdev/auth/forgot-password', payload, { responseType: 'text' }).subscribe({
    next: (res) => {
      this.successMsg = '📩 E-mail envoyé avec succès. Vérifie ta boîte mail.';
      this.errorMsg = '';
      this.loading = false;
    },
    error: (err) => {
      this.errorMsg = '❌ Adresse email invalide ou introuvable.';
      this.successMsg = '';
      this.loading = false;
    }
  });
}

  
}
