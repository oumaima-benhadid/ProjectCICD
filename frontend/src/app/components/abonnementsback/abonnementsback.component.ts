import { Component, OnInit } from '@angular/core';
import { AbonnementService } from '../../services/abonnement.service';

@Component({
  selector: 'app-abonnementsback',
  templateUrl: './abonnementsback.component.html',
  styleUrls: ['./abonnementsback.component.css']
})
export class AbonnementsbackComponent implements OnInit {
  abonnements: any[] = [];
  currentPage: number = 0;
  totalPages: number = 0;
  size: number = 5;
  sortBy: string = 'dateCreation';
  direction: string = 'asc';
  searchKeyword: string = '';
  showArchived = false;

  profilsIA: { [idUtilisateur: number]: string } = {}; // ✅ Ajouté
  renewalPredictions: { [idUtilisateur: number]: string } = {}; // ✅ Ajouté

  constructor(private abonnementService: AbonnementService) {}

  ngOnInit(): void {
    this.loadAbonnements();
  }

  loadAbonnements(): void {
    this.abonnementService.getPaged(this.currentPage, this.size, this.sortBy, this.direction)
      .subscribe(async response => {
        this.abonnements = response.content;
        this.totalPages = response.totalPages;
        await this.chargerProfilsIA();
        await this.chargerPredictionsIA();
      });
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.loadAbonnements();
  }

  changeSorting(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.sortBy = target.value;
    this.showArchived ? this.loadArchivedAbonnements() : this.loadAbonnements();
  }

  toggleSortDirection(): void {
    this.direction = this.direction === 'asc' ? 'desc' : 'asc';
    this.showArchived ? this.loadArchivedAbonnements() : this.loadAbonnements();
  }

  archiver(id: number): void {
    this.abonnementService.archive(id).subscribe(() => this.refreshCurrentList());
  }

  restaurer(id: number): void {
    this.abonnementService.restore(id).subscribe(() => this.refreshCurrentList());
  }

  search(): void {
    if (this.searchKeyword.trim() === '') {
      this.showArchived ? this.loadArchivedAbonnements() : this.loadAbonnements();
    } else {
      if (this.showArchived) {
        this.abonnementService.searchArchived(this.searchKeyword, this.currentPage, this.size, this.sortBy, this.direction)
          .subscribe(async response => {
            this.abonnements = response.content;
            this.totalPages = response.totalPages;
            await this.chargerProfilsIA();
            await this.chargerPredictionsIA();
          });
      } else {
        this.abonnementService.search(this.searchKeyword, this.currentPage, this.size, this.sortBy, this.direction)
          .subscribe(async response => {
            this.abonnements = response.content;
            this.totalPages = response.totalPages;
            await this.chargerProfilsIA();
            await this.chargerPredictionsIA();
          });
      }
    }
  }

  toggleArchivedView(): void {
    this.showArchived = !this.showArchived;
    this.searchKeyword = '';
    this.showArchived ? this.loadArchivedAbonnements() : this.loadAbonnements();
  }

  loadArchivedAbonnements(): void {
    this.abonnementService.getArchivedPaged(this.currentPage, this.size, this.sortBy, this.direction)
      .subscribe(async response => {
        this.abonnements = response.content;
        this.totalPages = response.totalPages;
        await this.chargerProfilsIA();
        await this.chargerPredictionsIA();
      });
  }

  refreshCurrentList(): void {
    this.searchKeyword.trim() === ''
      ? (this.showArchived ? this.loadArchivedAbonnements() : this.loadAbonnements())
      : this.search();
  }

  async chargerProfilsIA(): Promise<void> {
    this.profilsIA = {};
    const profilPromises = this.abonnements.map(ab => {
      const idUtilisateur = ab.idUtilisateur; // ✅ utilise idUtilisateur du DTO
      if (idUtilisateur != null) {
        return this.abonnementService.getProfilIA(idUtilisateur).toPromise()
          .then(res => this.profilsIA[idUtilisateur] = res?.profil ?? 'Profil absent')
          .catch(() => this.profilsIA[idUtilisateur] = 'Erreur IA');
      } else {
        return Promise.resolve();
      }
    });
    await Promise.all(profilPromises);
  }

  async chargerPredictionsIA(): Promise<void> {
    this.renewalPredictions = {};
    const renewalPromises = this.abonnements.map(ab => {
      const idUtilisateur = ab.idUtilisateur; // ✅ utilise idUtilisateur du DTO
      if (idUtilisateur != null) {
        return this.abonnementService.predictRenewal(idUtilisateur).toPromise()
          .then(res => this.renewalPredictions[idUtilisateur] = res?.prediction === 1 ? 'Renouvelle ✅' : 'Non-renouvelle ❌')
          .catch(() => this.renewalPredictions[idUtilisateur] = 'Erreur IA');
      } else {
        return Promise.resolve();
      }
    });
    await Promise.all(renewalPromises);
  }
}