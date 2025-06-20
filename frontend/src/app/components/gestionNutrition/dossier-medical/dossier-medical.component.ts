import { Component, OnInit } from '@angular/core';
import { DossierMedical, DossierMedicalService } from 'src/app/services/gestionNutrition/dossier-medical.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-dossier-medical',
  templateUrl: './dossier-medical.component.html',
  styleUrls: ['./dossier-medical.component.css']
})
export class DossierMedicalComponent implements OnInit {
  dossiers: DossierMedical[] = [];
  dossier: DossierMedical = this.resetForm();
  editMode = false;
  isAdmin = false;
  isRdvRecommended: boolean = false;
  recommendedDossier: DossierMedical | null = null;
  message: string | null = null;
  errorMessage: string | null = null;
  constructor(
    private dossierService: DossierMedicalService,
    private router: Router,
    private toastr: ToastrService

  ) {}

  ngOnInit(): void {
    this.fetchAllDossiers();
  }

  fetchAllDossiers(): void {
    this.dossierService.getMyDossier().subscribe({
      next: (data) => {
        if (data) {
          this.dossiers = [data];  // car c’est un seul dossier => mettre dans un tableau
          this.checkRecommendedRdv();
        }
      },
      error: (err) => {
        console.error("Erreur récupération dossier:", err);
        this.toastr.error("Erreur lors du chargement de votre dossier.");
      }
    });
  }
  
  checkRecommendedRdv(): void {
    this.isRdvRecommended = false;
    this.recommendedDossier = null;
    
    for (const d of this.dossiers) {
      if (d.rdvRecommande) {
        this.isRdvRecommended = true;
        this.recommendedDossier = d;
        break;
      }
    }
  }

  submitForm(): void {
    if (!this.dossier.maladies || !this.dossier.objectifSante || !this.dossier.traitements) {
      this.toastr.error("Veuillez remplir tous les champs !");
      return;
    }
  
    if (this.dossier.poids < 30) {
      this.toastr.error("Le poids doit être supérieur ou égal à 30 kg.");
      return;
    }
  
    if (this.dossier.tailles < 30) {
      this.toastr.error("La taille doit être supérieure ou égale à 30 cm.");
      return;
    }
  
    if (this.dossier.tailles && this.dossier.poids) {
      this.dossier.imc = this.dossier.poids / Math.pow(this.dossier.tailles / 100, 2);
    }
  
    if (this.editMode && this.dossier.idDossier) {
      this.dossierService.updateDossier(this.dossier).subscribe({
        next: () => {
          this.toastr.success('Dossier modifié avec succès !');
          this.resetAndReload();
        },
        error: (err) => {
          console.error('Erreur ajout :', err);
          this.errorMessage = err.error || "Une erreur est survenue lors de l'ajout";
        }
              });
    } else {
      this.dossierService.addDossier(this.dossier).subscribe({
        next: () => {
          this.toastr.success('Dossier ajouté avec succès !');
          this.resetAndReload();
        },
        error: (err) => {
          console.error("Erreur ajout :", err);
          this.toastr.error('Erreur lors de l\'ajout.');
        }
      });
    }
  }
  

  editDossier(d: DossierMedical): void {
    if (d.archived) {
      alert("Ce dossier est archivé.");
      return;
    }
    this.dossier = { ...d };
    this.editMode = true;
  }
  navigateToCalendar(): void {
    this.router.navigate(['/calender']);
  }
  navigateToIA(): void {
    this.router.navigate(['/IA']);
  }

  /*archiveDossier(id: number): void {
    this.dossierService.archiveDossier(id).subscribe(() => {
      this.fetchAllDossiers();
      this.dossier = this.resetForm();
      this.editMode = false;
    });
  }*/

    resetForm(): DossierMedical {
      return {
        user: null,
        maladies: '',
        objectifSante: '',
        traitements: '',
        tailles: 0,
        poids: 0,
        groupeSanguin: 'A_POS', // 👈 Donner une valeur par défaut ou vide ''
        allergies: 'AUTRES',
        archived: false,
        imc: 0,
        rdvRecommande: false
      };
    }
    

  resetAndReload(): void {
    this.dossier = this.resetForm();
    this.editMode = false;
    this.fetchAllDossiers();
  }

  navigateToRendezVous(): void {
    if (this.isRdvRecommended) {
      this.router.navigate(['/rendez-vous']);
    }
  }
}