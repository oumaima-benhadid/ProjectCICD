// src/app/change-password/change-password.component.ts
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  successMessage = '';
  errorMessage = '';
  isLoading = false;

  constructor(private http: HttpClient) {}

  changePassword() {
    this.clearMessages();
    this.isLoading = true;

    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      this.errorMessage = '❌ Tous les champs sont requis.';
      this.isLoading = false;
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = '❌ Les mots de passe ne correspondent pas.';
      this.isLoading = false;
      return;
    }

    if (!this.isStrongPassword(this.newPassword)) {
      this.errorMessage = '❌ Le mot de passe est trop faible.';
      this.isLoading = false;
      return;
    }

    const payload = {
      currentPassword: this.currentPassword,
      newPassword: this.newPassword,
      confirmPassword: this.confirmPassword
    };

    this.http.put('http://localhost:8081/PIdev/user/change-password', payload, { responseType: 'text' }).subscribe({
      next: (res: string) => {
        this.successMessage = res || '✅ Mot de passe mis à jour avec succès !';
        this.resetForm();
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = this.extractErrorMessage(err);
        this.isLoading = false;
      }
    });
  }

  private extractErrorMessage(err: any): string {
    if (typeof err.error === 'string') return err.error;
    if (err.error?.text) return err.error.text;
    return '❌ Erreur inconnue.';
  }

  isStrongPassword(password: string): boolean {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);
  }

  private resetForm() {
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
  }

  private clearMessages() {
    this.errorMessage = '';
    this.successMessage = '';
  }
}
