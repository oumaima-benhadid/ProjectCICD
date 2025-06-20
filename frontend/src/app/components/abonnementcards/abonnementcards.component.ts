import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-abonnementcards',
  templateUrl: './abonnementcards.component.html',
  styleUrls: ['./abonnementcards.component.css']
})
export class AbonnementcardsComponent {
  abonnements: any[] = [];

  constructor(private router: Router) {
    
  }

  

  goToAjout(): void {
    this.router.navigate(['/abonnements']);
  }

  /*allerVersRenouvellement(abonnement: any): void {
    // Optionnel : stocker les données dans sessionStorage
    sessionStorage.setItem('abonnementARenouveler', JSON.stringify(abonnement));
    this.router.navigate(['/renouvellement', 1]); // ID fictif
  }*/
    allerVersRenouvellement(): void {
      this.router.navigate(['/renouvellement']);
    }
    
  
}
