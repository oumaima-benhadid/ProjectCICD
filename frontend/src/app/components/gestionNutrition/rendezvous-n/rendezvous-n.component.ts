// FRONTEND: rendezvous-n.component.ts
import { Component, OnInit } from '@angular/core';
import { RendezvousService } from 'src/app/services/gestionNutrition/rendezvous.service';
import { RendezVous, StatutRendezVous } from 'src/app/models/RendezVous.model';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-rendezvous-n',
  templateUrl: './rendezvous-n.component.html',
  styleUrls: ['./rendezvous-n.component.css']
})
export class RendezvousNComponent implements OnInit {
  rendezvousList: RendezVous[] = [];
  statutOptions = Object.values(StatutRendezVous);
  currentNutritionnisteId!: number;

  constructor(
    private rendezvousService: RendezvousService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.authService.getCurrentUserFromApi().subscribe({
      next: (user) => {
        this.currentNutritionnisteId = user.id;
        this.loadRendezVous();
      },
      error: () => {
        this.toastr.error('Erreur lors de la récupération du nutritionniste connecté');
      }
    });
  }

  loadRendezVous(): void {
    this.rendezvousService.retrieveAllRendezVous().subscribe({
      next: (data) => {
        this.rendezvousList = data;
      },
      error: (err) => {
        console.error('Erreur chargement rendez-vous:', err);
      }
    });
  }

  updateStatut(rdv: RendezVous, newStatut: string): void {
    if (!rdv.idRendezVous || newStatut === rdv.statut) return;

    if (rdv.nutritioniste?.idUser !== this.currentNutritionnisteId) {
      this.toastr.warning("Non autorisé à modifier ce rendez-vous.");
      return;
    }

    this.rendezvousService.updateStatutRendezvous(rdv.idRendezVous, newStatut).subscribe({
      next: () => {
        rdv.statut = newStatut as StatutRendezVous;
        this.toastr.success(`Statut mis à jour en ${newStatut}`);
      },
      error: () => {
        this.toastr.error("Mise à jour échouée");
      }
    });
  }

  navigateTodossierN(): void {
    this.router.navigate(['/nutritionniste/dossier-nutritionniste']).catch(err => {
      this.toastr.error('Navigation échouée');
    });
  }
}
