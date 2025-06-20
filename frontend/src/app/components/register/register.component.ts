import { Component } from '@angular/core';
import { RegisterService } from '../../services/register.service';
import { Router } from '@angular/router';
import { ReCaptchaV3Service } from 'ng-recaptcha';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user: any = {
    nom: '',
    prenom: '',
    email: '',
    password: '',
    dateNaissance: '',
    sexe: '',
    numeroDeTelephone: '',
    photoProfil: '',
    role: ''
  };

  captchaValid: boolean = false;
  errorMsg: string = '';
  successMsg: string = '';
  selectedFile: File | null = null;
  loading: boolean = false;
  captchaReady: boolean = false;

  constructor(
    private registerService: RegisterService,
    private router: Router,
    private recaptchaV3Service: ReCaptchaV3Service
  ) {}

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  register(): void {
    this.errorMsg = '';
    this.successMsg = '';

    if (!this.user.nom || !this.user.prenom || !this.user.email || !this.user.password ||
        !this.user.dateNaissance || !this.user.sexe || !this.user.numeroDeTelephone || !this.user.role) {
      this.errorMsg = '❌ Tous les champs sont obligatoires.';
      return;
    }
    this.captchaReady = false;
    this.captchaValid = false;
    
    this.loading = true;

    this.recaptchaV3Service.execute('register').subscribe({
      next: (token: string) => {
        if (!token) {
          this.errorMsg = '⚠️ CAPTCHA invalide.';
          this.loading = false;
          return;
        }
        this.captchaReady = true; 

        const fullPayload = { ...this.user, captchaToken: token };
        const formData = new FormData();
        formData.append('user', new Blob([JSON.stringify(fullPayload)], { type: 'application/json' }));

        if (this.selectedFile) {
          formData.append('photo', this.selectedFile);
        }

        this.registerService.registerUser(formData).subscribe({
          next: (res: any) => {
            if (res && res.message && res.message.includes('✔️')) {
              this.successMsg = '✔️ Inscription réussie.';
              this.captchaValid = true;
              sessionStorage.setItem('pendingEmail', this.user.email);
              this.router.navigate(['/verify-code']);
                          } else {
              this.errorMsg = res.message || 'Erreur inattendue.';
            }
            this.loading = false;
          },
          error: (err) => {
            this.errorMsg = err.error || 'Erreur lors de l’inscription.';
            this.loading = false;
          }
        });
      },
      error: () => {
        this.errorMsg = 'Erreur lors de l\'exécution du CAPTCHA.';
        this.loading = false;
      }
    });
  }
}
