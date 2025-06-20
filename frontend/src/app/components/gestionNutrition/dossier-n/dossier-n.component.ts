import { Component, OnInit } from '@angular/core';
import { DossierMedicalService } from 'src/app/services/gestionNutrition/dossier-medical.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-dossier-n',
  templateUrl: './dossier-n.component.html',
  styleUrls: ['./dossier-n.component.css']
})
export class DossierNComponent implements OnInit {
  dossiers: any[] = [];

  constructor(private dossierService: DossierMedicalService,
        private router: Router,
        private toastr: ToastrService 
  ) {}


  ngOnInit(): void {
    this.getAllDossiers();
  }

  getAllDossiers(): void {
    this.dossierService.getAllDossiers().subscribe(
      (dossiers: any[]) => {
        this.dossiers = dossiers.map(dossier => {
          const poids = parseFloat(dossier.poids);
          const tailles = parseFloat(dossier.tailles);

          let imc = 0;

          if (!isNaN(poids) && !isNaN(tailles) && tailles > 0) {
            const tailleEnMetres = tailles / 100;
            imc = poids / (tailleEnMetres * tailleEnMetres);
            imc = parseFloat(imc.toFixed(2));
          }

          return {
            ...dossier,
            poids: poids || 0,
            tailles: tailles || 0,
            imc: imc
          };
        });
      },
      (error) => {
        console.error('Erreur lors de la récupération des dossiers :', error);
      }
    );
  }

  updateRdvRecommande(dossier: any): void {
    const newRdv = !dossier.rdvRecommande;
  
    this.dossierService.updateRdvRecommande(dossier.idDossier, newRdv).subscribe(
      () => {
        const index = this.dossiers.findIndex(d => d.idDossier === dossier.idDossier);
        if (index !== -1) {
          // Créer une nouvelle référence de l'objet modifié
          this.dossiers[index] = {
            ...this.dossiers[index],
            rdvRecommande: newRdv
          };
  
          // 🔁 Forcer le changement si nécessaire
          this.dossiers = [...this.dossiers];
        }
      },
      (error) => {
        console.error('Erreur lors de la mise à jour du rendez-vous recommandé :', error);
      }
    );
  }
  }