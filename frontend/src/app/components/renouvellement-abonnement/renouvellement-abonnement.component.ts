import { Component, OnInit } from '@angular/core';
import { AbonnementService } from 'src/app/services/abonnement.service';
import { ToastrService } from 'ngx-toastr';
import { PaymentService } from 'src/app/services/stripe/payment.service';
import { Stripe, StripeCardElement } from '@stripe/stripe-js';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-renouvellement-abonnement',
  templateUrl: './renouvellement-abonnement.component.html',
  styleUrls: ['./renouvellement-abonnement.component.css']
})
export class RenouvellementAbonnementComponent implements OnInit {
  idUser!: number;
  pointsFidelite: number = 0;
  montantInitial: number = 0;
 montantReduit: number = 0;
 reduction: number = 0;


  typeAbonnement = '';
  dureeAbonnement = '';
  montant!: number;

  stripe!: Stripe | null;
  card!: StripeCardElement;

  typeOptions = ['BASIC', 'PREMIUM', 'VIP'];
  dureeOptions = ['MENSUEL', 'ANNUEL', 'SEMESTRIEL'];

  constructor(
    private abonnementService: AbonnementService,
    private toastr: ToastrService,
    private paymentService: PaymentService,
    private authService: AuthService,
    private router: Router // ✅ ajoute ceci

  ) {}

  /*async ngOnInit() {
    this.loadPointsFidelite();
    this.stripe = await this.paymentService.getStripe();
    const elements = this.stripe?.elements();
    if (elements) {
      this.card = elements.create('card');
      this.card.mount('#card-element');
    }
  }*/
    async ngOnInit() {
      const id = this.authService.getCurrentUserIdFromToken();
      if (id) {
        this.idUser = id;
        this.loadPointsFidelite();
      } else {
        this.toastr.error('Utilisateur non authentifié. Veuillez vous reconnecter.');
        this.router.navigate(['/login']);
      }
    
      this.stripe = await this.paymentService.getStripe();
      const elements = this.stripe?.elements();
      if (elements) {
        this.card = elements.create('card');
        this.card.mount('#card-element');
      }
    }

  /*async renouveler() {
    const { paymentMethod, error } = await this.stripe!.createPaymentMethod({
      type: 'card',
      card: this.card
    });

    if (error) {
      this.toastr.error('Erreur de carte : ' + error.message);
      return;
    }

    this.abonnementService.renouvelerAbonnementParUser(
      this.dureeAbonnement.toUpperCase(), // 👈 ici on met en MAJUSCULE
      this.typeAbonnement.toUpperCase(),  // 👈 idem pour le type
      paymentMethod.id
    )
    
    .subscribe({
      next: () => {
        this.toastr.success('✅ Abonnement renouvelé avec succès !');
        this.router.navigate(['/abonnements-cards']);
      },
      error: err => {
        this.toastr.error('❌ Erreur : ' + (err.error?.message || 'Échec du renouvellement.'));
        console.error(err);
      }
    });
    
    
  }*/
    async renouveler() {
      const { paymentMethod, error } = await this.stripe!.createPaymentMethod({
        type: 'card',
        card: this.card
      });
    
      if (error) {
        this.toastr.error('Erreur de carte : ' + error.message);
        return;
      }
    
      this.abonnementService.renouvelerAbonnementParUser(
        this.dureeAbonnement.toUpperCase(),
        this.typeAbonnement.toUpperCase(),
        paymentMethod.id
      ).subscribe({
        next: (abonnementDto) => {
          this.toastr.success('✅ Abonnement renouvelé avec succès ! Montant payé : ' + abonnementDto.montant + ' DT');
    
          console.log('ℹ️ DTO retourné :', abonnementDto);
    
          // 💡 Recalculer proprement montantInitial et réduction
          const tarifs: any = {
            BASIC: { MENSUEL: 100, SEMESTRIEL: 450, ANNUEL: 950 },
            PREMIUM: { MENSUEL: 200, SEMESTRIEL: 650, ANNUEL: 1050 },
            VIP: { MENSUEL: 450, SEMESTRIEL: 1500, ANNUEL: 2500 }
          };
    
          const type = abonnementDto.typeAbonnement.toUpperCase();
          const duree = abonnementDto.dureeAbonnement.toUpperCase();
    
          this.montantInitial = tarifs[type]?.[duree] || 0;

           if (abonnementDto.pointsFidelite >= 5) {
             this.reduction = this.montantInitial * (abonnementDto.pointsFidelite / 100);
             this.montantReduit = this.montantInitial - this.reduction;
           } else {
              this.reduction = 0;
               this.montantReduit = this.montantInitial;
          }

    
          this.montant = abonnementDto.montant;
          this.pointsFidelite = abonnementDto.pointsFidelite;
    
         /* setTimeout(() => {
            this.router.navigate(['/abonnements-cards']);
          }, 3000);*/
        },
        error: err => {
          this.toastr.error('❌ Erreur : ' + (err.error?.message || 'Échec du renouvellement.'));
          console.error(err);
        }
      });
    }
    
    
    
    

  
    calculateMontant(): void {
      const tarifs: any = {
        BASIC: { MENSUEL: 100, SEMESTRIEL: 450, ANNUEL: 950 },
        PREMIUM: { MENSUEL: 200, SEMESTRIEL: 650, ANNUEL: 1050 },
        VIP: { MENSUEL: 450, SEMESTRIEL: 1500, ANNUEL: 2500 }
      };
    
      const type = this.typeAbonnement.toUpperCase();
      const duree = this.dureeAbonnement.toUpperCase();
    
      this.montantInitial = tarifs[type]?.[duree] || 0;
    
      if (this.pointsFidelite >= 5) {
        const reduction = this.montantInitial * (this.pointsFidelite / 100);
        this.montantReduit = this.montantInitial - reduction;
      } else {
        this.montantReduit = this.montantInitial;
      }
  
      this.montant = this.montantReduit; // pour affichage Stripe
    }
    
  /*loadPointsFidelite() {
    if (this.idUser) {
      this.abonnementService.getPointsFidelite(this.idUser).subscribe({
        next: (points) => this.pointsFidelite = points,
        error: () => this.pointsFidelite = 0
      });
    }
  }*/
   /* loadPointsFidelite() {
      if (this.idUser && this.idUser > 0) {
        this.abonnementService.getPointsFidelite(this.idUser).subscribe({
          next: (points) => {
            this.pointsFidelite = points;
            console.log('📌 Points fidélité récupérés :', points);
          },
          error: (err) => {
            console.error('❌ Erreur récupération points fidélité :', err);
            this.pointsFidelite = 0;
          }
        });
      }
    }*/
      loadPointsFidelite() {
        if (this.idUser && this.idUser > 0) {
          this.abonnementService.getPointsFidelite(this.idUser).subscribe({
            next: (points) => {
              this.pointsFidelite = points;
              console.log('📌 Points fidélité récupérés :', points);
              this.calculateMontant(); // <<<<<< AJOUTER CETTE LIGNE
            },
            error: (err) => {
              console.error('❌ Erreur récupération points fidélité :', err);
              this.pointsFidelite = 0;
              this.calculateMontant(); // <<<<<< AUSSI si erreur
            }
          });
        }
      }
      
    
  
}