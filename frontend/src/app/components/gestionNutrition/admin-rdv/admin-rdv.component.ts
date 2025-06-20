import { Component, OnInit } from '@angular/core';
import { RendezvousService } from 'src/app/services/gestionNutrition/rendezvous.service';
import { RendezVous, StatutRendezVous } from 'src/app/models/RendezVous.model';

@Component({
  selector: 'app-admin-rdv',
  templateUrl: './admin-rdv.component.html',
  styleUrls: ['./admin-rdv.component.css']
})
export class AdminRdvComponent implements OnInit {
  rendezVousActifs: RendezVous[] = [];
  rendezVousArchives: RendezVous[] = [];
  loading = false;
  activeTab: string = 'actifs';
  searchTerm: string = '';
  selectedStatut: string = 'TOUS';
  statutRendezVousEnum = StatutRendezVous;
  statutOptions = [
    { value: 'TOUS', label: 'Tous les statuts' },
    { value: StatutRendezVous.EN_COURS, label: 'En cours' },
    { value: StatutRendezVous.ACCEPTE, label: 'Accepté' },
    { value: StatutRendezVous.REFUSE, label: 'Refusé' }
  ];

  constructor(private rendezvousService: RendezvousService) {}

  ngOnInit(): void {
    this.loadRendezVous();
  }

  loadRendezVous(): void {
    this.loading = true;
    
    this.rendezvousService.retrieveAllRendezVous().subscribe({
      next: (actifs) => {
        this.rendezVousActifs = actifs;
        this.loadArchives();
      },
      error: (err) => {
        console.error('Erreur chargement rendez-vous actifs:', err);
        this.loading = false;
      }
    });
  }

  loadArchives(): void {
    this.loading = true;
    this.rendezvousService.getArchivedRendezVous().subscribe({
      next: (archives) => {
        this.rendezVousArchives = archives;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement archives:', err);
        this.loading = false;
      }
    });
  }

  archiveRendezVous(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir archiver ce rendez-vous ?')) {
      this.rendezvousService.archiveRendezVous(id).subscribe({
        next: () => {
          this.loadRendezVous();
        },
        error: (err) => {
          console.error('Erreur lors de l\'archivage:', err);
          alert('Erreur: ' + (err.error?.message || err.message));
        }
      });
    }
  }

  restoreRendezVous(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir restaurer ce rendez-vous ?')) {
      this.rendezvousService.restoreRendezVous(id).subscribe({
        next: () => {
          this.loadRendezVous();
        },
        error: (err) => alert('Erreur: ' + (err.error?.message || err.message))
      });
    }
  }

  switchTab(tab: string): void {
    this.activeTab = tab;
    this.searchTerm = '';
    this.selectedStatut = 'TOUS';
  }

  private matchesSearch(rdv: RendezVous): boolean {
    if (!this.searchTerm) return true;
    
    const searchTermLower = this.searchTerm.toLowerCase();
    return rdv.remarque.toLowerCase().includes(searchTermLower) ||
           (rdv.etudiant?.idUser.toString().includes(this.searchTerm)) ||
           (rdv.nutritioniste?.idUser.toString().includes(this.searchTerm));
  }

  get filteredActifs() {
    return this.rendezVousActifs.filter(rdv => 
      (this.selectedStatut === 'TOUS' || rdv.statut === this.selectedStatut) &&
      this.matchesSearch(rdv)
    );
  }

  get filteredArchives() {
    return this.rendezVousArchives.filter(rdv => 
      (this.selectedStatut === 'TOUS' || rdv.statut === this.selectedStatut) &&
      this.matchesSearch(rdv)
    );
  }

  getStatutLabel(statut: StatutRendezVous): string {
    switch(statut) {
      case StatutRendezVous.EN_COURS: return 'En cours';
      case StatutRendezVous.ACCEPTE: return 'Accepté';
      case StatutRendezVous.REFUSE: return 'Refusé';
      default: return statut;
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR');
  }
}