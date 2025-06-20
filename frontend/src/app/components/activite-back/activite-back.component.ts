import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { Activite, StatutActivite } from 'src/app/models/activite';
import { SeanceSport } from 'src/app/models/SeanceSport';
import { ActiviteServiceService } from 'src/app/services/activite-service.service';
import { SeanceService } from 'src/app/services/seance.service';

@Component({
  selector: 'app-activite-back',
  templateUrl: './activite-back.component.html',
  styleUrls: ['./activite-back.component.css']
})
export class ActiviteBackComponent {

  selectedActiviteId: number | null = null;
  seances: SeanceSport[] = [];
  searchTerm: string = ''; // Ajoutez cette ligne

    activites: Activite[] = [];
    newActivite: Activite = {
        id: 0,
        nomActivite: '',
        description: '',
        image: '',
        statutActivite: StatutActivite.ACTIVE,

        seance_sports: []
      };

    sub!: Subscription;
    isEditMode: boolean = false;
    showForm: boolean = false;
    subscription: any;

    constructor(private seanceService: SeanceService,
      private activiteService: ActiviteServiceService) {} // 👈 c'est ici que l'injection se fait !

    ngOnInit(): void {

      this.fetchActivites();
    }

    imageFile: File | null = null;

    onFileChange(event: any): void {
      const file = event.target.files[0];
      if (file) {
        this.imageFile = file;
      }
    }
   ngOnDestroy(): void {
      if (this.sub) {
        this.sub.unsubscribe();
      }
    }
  viewSeances(activite: any): void {
    console.log(`Afficher les séances pour l'activité : ${activite.nomActivite}`);
    // Naviguez vers une autre page ou affichez les séances dans un modal.
  }

  fetchActivites(): void {
    this.activiteService.getAll().subscribe((response: Activite[]) => {
      this.activites = response;
    });
  }
  logActiviteId(id: number): void {
    console.log('Activité ID:', id);
  }

  addActivite(): void {
    if (this.isEditMode) {
      // Mise à jour
      this.activiteService.update(this.newActivite).subscribe({
        next: () => {
          this.fetchActivites();
          this.resetForm();
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour :', err);
        }
      });
    } else {
      // Création
      this.activiteService.create(this.newActivite).subscribe({
        next: () => {
          this.fetchActivites();
          this.resetForm();
        },
        error: (err) => {
          console.error('Erreur lors de l’ajout :', err);
        }
      });
    }
  }


  deleteActivite(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette activité ?')) {
      this.activiteService.delete(id).subscribe(() => {
        this.fetchActivites();
      });
    }
  }

  openAddForm(): void {
    this.resetForm();
    this.showForm = true;
    this.isEditMode = false;
  }

  openEditForm(activite: Activite): void {
    this.newActivite = { ...activite };
    this.showForm = true;
    this.isEditMode = true;
  }

  submitForm(): void {
    if (!this.newActivite.nomActivite || !this.newActivite.description || !this.newActivite.statutActivite) {
      console.error('Le formulaire contient des erreurs.');
      return;
    }

    const activitePayload: Activite = {
      id: this.newActivite.id,
      nomActivite: this.newActivite.nomActivite,
      description: this.newActivite.description,
      statutActivite: this.newActivite.statutActivite,
      seance_sports: []
    };
    if (this.isEditMode) {
      this.activiteService.update(activitePayload).subscribe({
        next: () => {
          if (this.imageFile) {
            this.uploadImage(activitePayload.id);
          }
          this.fetchActivites();
          this.cancelForm();
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour :', err);
        }
      });
    } else {
      this.activiteService.addActiviteWithImage(activitePayload, this.imageFile!).subscribe({
        next: () => {
          this.fetchActivites();
          this.cancelForm();
        },
        error: (err) => {
          console.error("Erreur lors de l'ajout de l'activité avec image :", err);
        }
      });
    }
  }


  cancelForm(): void {
    this.showForm = false;
    this.resetForm();
  }

  resetForm(): void {
    this.newActivite = {
      id: 0,
      nomActivite: '',
      description: '',
      image: '',
      statutActivite: StatutActivite.ACTIVE,
      seance_sports: []
    };
  }

  toggleSeances(activiteId: number): void {
    if (this.selectedActiviteId === activiteId) {
      this.selectedActiviteId = null;
      this.seances = [];
    } else {
      this.selectedActiviteId = activiteId;
      this.loadSeancesByActivite(activiteId);
    }
  }

  loadSeancesByActivite(activiteId: number): void {
    this.seanceService.getByActiviteId(activiteId).subscribe({
      next: (data) => {
        this.seances = data; // Stocke les séances récupérées
        console.log(`Séances pour l'activité ${activiteId}:`, this.seances);
      },
      error: (err) => console.error('Erreur lors du chargement des séances', err)
    });

  }
  uploadImage(id: number): void {
    if (this.imageFile) {
      const formData = new FormData();
      formData.append('image', this.imageFile);

      this.activiteService.uploadImage(id, formData).subscribe({
        next: () => console.log('✅ Image uploadée avec succès.'),
        error: (err) => console.error('❌ Erreur upload image :', err)
      });
    }
  }
}
