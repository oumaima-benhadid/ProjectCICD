import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  loading = false;
  countdown = '';
  intervalId: any = null;
  showPassword = false;
  message: string | null = null;
  isNutritionniste = false;


  constructor(
    private authService: AuthService,
    private router: Router,
        private route: ActivatedRoute,
        private http: HttpClient,

    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const stored = sessionStorage.getItem('blockedUntil');
    if (stored) this.startCountdownTimer(stored);


    this.route.queryParams.subscribe(params => {
      const reservationId = params['reservationId'];
      if (reservationId) {
        console.log("📦 ID de réservation reçu :", reservationId);
        this.http.put(`http://localhost:8081/PIdev/reservations/confirm-reservation/${reservationId}`, null)
          .subscribe({
            next: () => {
              this.message = "✅ Votre réservation a été confirmée avec succès.";
              this.toastr.success(this.message);
            },
            error: () => {
              this.message = "❌ Une erreur est survenue lors de la confirmation.";
              this.toastr.error(this.message);
            }
          });
      }
    });
  }

  startCountdownTimer(until: string) {
    const blockedTime = new Date(until);
    sessionStorage.setItem('blockedUntil', blockedTime.toISOString());

    this.intervalId = setInterval(() => {
      const now = new Date().getTime();
      const distance = blockedTime.getTime() - now;

      if (distance <= 0) {
        clearInterval(this.intervalId);
        this.countdown = '';
        sessionStorage.removeItem('blockedUntil');
        return;
      }

      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      this.countdown = `${minutes}m ${seconds < 10 ? '0' + seconds : seconds}s restantes`;

      this.toastr.clear(); // clear previous toastr to prevent stacking
    }, 1000);
  }

  onLogin(): void {
    const savedUntil = sessionStorage.getItem('blockedUntil');
    if (savedUntil) {
      const now = new Date().getTime();
      const untilTime = new Date(savedUntil).getTime();
      if (untilTime > now) {
        this.startCountdownTimer(savedUntil);
        return;
      } else {
        sessionStorage.removeItem('blockedUntil');
      }
    }
  
    this.loading = true;
    const loginPayload = { email: this.email, password: this.password };
  
    this.authService.login(loginPayload).subscribe({
      next: (res: any) => {
        const { token, role, banned } = res;
        this.loading = false;
  
        if (banned) {
          this.toastr.error("🚫 Votre compte a été banni.");
          return;
        }
  
        this.authService.saveSession(token, role);
        sessionStorage.setItem('jwt_token', token);
        clearInterval(this.intervalId);
        sessionStorage.removeItem('blockedUntil');
  
        // ✅ Redirection prioritaire vers route précédente (après login réussi)
        const redirect = sessionStorage.getItem('redirectAfterLogin');
        if (redirect) {
          sessionStorage.removeItem('redirectAfterLogin');
          this.router.navigateByUrl(redirect);
          return;
        }
  
        // Redirection par rôle
        if (role === 'Admin') {
          this.toastr.success("Connexion réussie", "Bienvenue Admin");
          this.router.navigate(['/admin/dashboard']);
        } else if (role === 'Etudiant') {
          this.toastr.success("Connexion réussie", "Bienvenue Étudiant");
          this.router.navigate(['/']);
        } else if (role === 'Coach') {
          this.toastr.success("Connexion réussie", "Bienvenue Coach");
          this.router.navigate(['/admin-coach']);
        } else if (role === 'Nutritionniste') {
          this.toastr.success("Connexion réussie", "Bienvenue Nutritionniste");
          this.router.navigate(['/nutritionniste/dossier-nutritionniste','/nutritionniste/RendezVousNutritionniste']);
        } else {
          alert('Rôle non autorisé');
        }
      },
  
      error: (err) => {
        this.loading = false;
        const msg = err.error;
  
        if (typeof msg === 'string' && msg.includes('temporairement bloqué')) {
          const match = msg.match(/jusqu'à (.*?)$/);
          if (match) {
            const until = match[1];
            this.startCountdownTimer(until);
          }
        } else {
          this.toastr.warning("Identifiants invalides", "Erreur de connexion");
        }
      }
    });
  }
  
}
