import { Component, OnInit } from '@angular/core';
import { DossierMedicalService } from 'src/app/services/gestionNutrition/dossier-medical.service';

@Component({
  selector: 'app-admin-dossiers',
  templateUrl: './admin-dossiers.component.html',
  styleUrls: ['./admin-dossiers.component.css']
})
export class AdminDossiersComponent implements OnInit {
  dossiersActifs: any[] = [];
  dossiersArchives: any[] = [];
  loading = false;
  activeTab: string = 'actifs';
  searchTerm: string = '';

  constructor(private dossierService: DossierMedicalService) {}

  ngOnInit(): void {
    this.loadDossiers();
  }

  loadDossiers(): void {
    this.loading = true;

    this.dossierService.getAllDossiers().subscribe({
      next: (actifs) => {
        this.dossiersActifs = actifs || [];
        this.loadArchives(); // On attend d'avoir chargés les actifs pour charger les archives
      },
      error: (err) => {
        console.error('Erreur chargement dossiers actifs:', err);
        this.loading = false;
        alert('Erreur lors du chargement des dossiers actifs');
      }
    });
  }

  loadArchives(): void {
    this.dossierService.getArchivedDossiers().subscribe({
      next: (archives) => {
        this.dossiersArchives = archives || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement archives:', err);
        this.loading = false;
        alert('Erreur lors du chargement des dossiers archivés');
      }
    });
  }

  archiveDossier(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir archiver ce dossier ?')) {
      this.dossierService.archiveDossier(id).subscribe({
        next: () => {
          // Mise à jour immédiate sans reload complet
          this.dossiersActifs = this.dossiersActifs.filter(d => d.idDossier !== id);
          this.loadArchives(); // On recharge uniquement les archives
          this.activeTab = 'actifs';
        },
        error: (err) => {
          console.error('Erreur lors de l\'archivage:', err);
          alert('Erreur lors de l\'archivage: ' + (err.error?.message || err.message));
        }
      });
    }
  }

  restoreDossier(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir restaurer ce dossier ?')) {
      this.dossierService.restoreDossier(id).subscribe({
        next: () => {
          // Mise à jour immédiate sans reload complet
          this.dossiersArchives = this.dossiersArchives.filter(d => d.idDossier !== id);
          this.loadDossiers(); // Recharge tout (actifs + archives) pour revenir proprement
          this.activeTab = 'archives';
        },
        error: (err) => {
          console.error('Erreur lors de la restauration:', err);
          alert('Erreur lors de la restauration: ' + (err.error?.message || err.message));
        }
      });
    }
  }

  switchTab(tab: string): void {
    this.activeTab = tab;
    this.searchTerm = '';
  }

  get filteredActifs() {
    return this.dossiersActifs.filter(dossier =>
      dossier.maladies.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      dossier.objectifSante.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      dossier.traitements.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      (dossier.groupeSanguin && dossier.groupeSanguin.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
      (dossier.allergies && dossier.allergies.toLowerCase().includes(this.searchTerm.toLowerCase()))
    );
  }

  get filteredArchives() {
    return this.dossiersArchives.filter(dossier =>
      dossier.maladies.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      dossier.objectifSante.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      dossier.traitements.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      (dossier.groupeSanguin && dossier.groupeSanguin.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
      (dossier.allergies && dossier.allergies.toLowerCase().includes(this.searchTerm.toLowerCase()))
    );
  }
}
