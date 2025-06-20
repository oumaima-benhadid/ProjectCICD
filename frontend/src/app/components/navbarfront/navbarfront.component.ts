// src/app/components/navbarfront/navbarfront.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbarfront',
  templateUrl: './navbarfront.component.html',
  styleUrls: ['./navbarfront.component.css']
})
export class NavbarfrontComponent implements OnInit {
  isLoggedIn = false;
  role: string | null = null;
  isEtudiant = this.authService.getRole() === 'Etudiant';
  isNutritionniste = this.authService.getRole() === 'Nutritionniste';
  isAdmin = this.authService.getRole() === 'Admin';
  
  constructor(public authService: AuthService , private router: Router) {}

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe(() => {
      this.checkLoginStatus();
    });
  
    // Also respond to tab changes
    window.addEventListener('storage', () => this.checkLoginStatus());
    this.checkLoginStatus();
  }
  checkLoginStatus(): void {
    this.isLoggedIn = this.authService.isAuthenticated();
    const role = this.authService.getRole()?.toUpperCase();
  
    this.isEtudiant = role === 'ETUDIANT';
    this.isNutritionniste = role === 'NUTRITIONNISTE';
    this.isAdmin = role === 'ADMIN';
  }
  
  
  logout(): void {
    this.authService.logout();
  }
  goToEvenements(event: Event): void {
    event.preventDefault();

    if (this.router.url === '/evenements') {
      const section = document.getElementById('evenement-section');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      this.router.navigate(['/evenements']).then(() => {
        setTimeout(() => {
          const section = document.getElementById('evenement-section');
          if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
          }
        }, 300);
      });
    }
  }

}
