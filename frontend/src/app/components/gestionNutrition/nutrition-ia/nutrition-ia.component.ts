import { Component } from '@angular/core';
import { NutritionIAService } from 'src/app/services/gestionNutrition/nutrition-ia.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr'; 

@Component({
  selector: 'app-nutrition-ia',
  templateUrl: './nutrition-ia.component.html',
  styleUrls: ['./nutrition-ia.component.css']
})
export class NutritionIAComponent {
  dossierId = 1;
  activity = 'musculation';
  duration = 60;
  city = 'Tunis';

  result: any;
  isLoading = false;
  error: string | null = null;

  constructor(
    private nutritionIAService: NutritionIAService,
    private router: Router,
    private toastr: ToastrService // Ajout de l'injection manquante
  ) {}

  getPrediction() {
    this.isLoading = true;
    this.error = null;
    this.result = null;

    this.nutritionIAService.getPrediction(
      this.dossierId,
      this.activity,
      this.duration,
      this.city
    ).subscribe({
      next: (data) => {
        this.result = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.error?.error || 'Erreur lors de la prédiction';
        this.isLoading = false;
      }
    });
  }

  navigateTodossier(): void {
    this.router.navigate(['/dossier-medical']).then(nav => {
      console.log('Navigation vers dossier médical réussie');
    }).catch(err => {
      console.error('Erreur de navigation:', err);
      this.toastr.error('Impossible d\'accéder au dossier médical', 'Erreur');
    });
  }
}