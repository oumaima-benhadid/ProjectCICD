import { Component } from '@angular/core';
import { ContactService } from '../../services/contact.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {

  form = {
    name: '',
    subject: '',
    message: ''
    // Email n'est plus demandé dans le formulaire
  };

  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(private contactService: ContactService,  private authService: AuthService,
    private router: Router
  ) {}
  sendMessage() {
    if (!this.authService.isLoggedIn()) {
      Swal.fire({
        icon: 'warning',
        title: 'Connexion requise',
        text: 'Veuillez vous connecter pour envoyer un message.',
        confirmButtonText: 'Se connecter',
        confirmButtonColor: '#B3001B'
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/login']);
        }
      });
      return; // ❗ Très important pour stopper l'envoi
    }
  
    // Sinon, l'utilisateur est connecté, on continue normalement
    if (!this.form.name || !this.form.subject || !this.form.message) {
      this.errorMessage = "❌ Tous les champs sont obligatoires.";
      return;
    }
  
    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';
  
    this.contactService.sendContactForm(this.form).subscribe({
      next: (response) => {
        this.loading = false;
        this.form = { name: '', subject: '', message: '' };
        Swal.fire({
          icon: 'success',
          title: 'Message envoyé !',
          text: 'Votre message a bien été envoyé à FitMind 🎉',
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
          position: 'top-end',
          toast: true
        });
      },
      error: (error) => {
        console.error(error);
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Erreur...',
          text: 'Impossible d\'envoyer le message !',
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
          position: 'top-end',
          toast: true
        });
      }
    });
  }
  
  }
