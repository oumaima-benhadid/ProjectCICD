import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RendezvousService } from 'src/app/services/gestionNutrition/rendezvous.service';
import { RendezVous, StatutRendezVous } from 'src/app/models/RendezVous.model';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-rendezvous',
  templateUrl: './rendezvous.component.html',
  styleUrls: ['./rendezvous.component.css']
})
export class RendezvousComponent implements OnInit {
  rendezVous: RendezVous = this.resetForm();
  allRendezVous: RendezVous[] = [];
  editMode = false;
  loading = false;
  minDate: string;
  StatutRendezVous = StatutRendezVous;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  userId!: number;

  constructor(
    private rendezvousService: RendezvousService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService
  ) {
    this.minDate = this.formatDateTimeLocal(new Date());
  }

  ngOnInit(): void {
    this.authService.getCurrentUserFromApi().subscribe({
      next: (user) => {
        this.userId = user.id;

        const paramId = this.route.snapshot.paramMap.get('id');
        if (paramId && Number(paramId) > 0) {
          this.editMode = true;
          this.loadRendezVous(Number(paramId));
        } else {
          this.editMode = false;
          this.rendezVous.dateHeure = this.minDate;
        }

        this.loadAllRendezVous();
      },
      error: (err) => {
        console.error("Erreur récupération utilisateur:", err);
        this.toastr.error("Impossible de récupérer vos informations utilisateur.");
      }
    });
  }

  loadRendezVous(id: number): void {
    this.rendezvousService.retrieveRendezVous(id).subscribe({
      next: (data) => {
        this.rendezVous = {
          ...data,
          dateHeure: this.formatDateTimeLocal(data.dateHeure)
        };
      },
      error: (err) => console.error('Erreur lors du chargement du rendez-vous :', err)
    });
  }

  loadAllRendezVous(): void {
    this.loading = true;
    this.rendezvousService.getMesRendezVous().subscribe({
      next: (data) => {
        this.allRendezVous = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des RDV étudiant :', err);
        this.loading = false;
        this.toastr.error("Impossible de charger vos rendez-vous");
      }
    });
  }

  submitForm(): void {
    if (!this.validateForm()) return;

    const selectedDate = new Date(this.rendezVous.dateHeure);
    const now = new Date();

    if (selectedDate < now) {
      this.errorMessage = "La date du rendez-vous ne peut pas être dans le passé";
      return;
    }

    this.errorMessage = null;

    if (this.editMode && this.rendezVous.idRendezVous) {
      this.rendezvousService.updateRendezVous(this.rendezVous.idRendezVous, this.rendezVous).subscribe({
        next: () => this.resetAndReload(),
        error: (err) => {
          console.error('Erreur modification :', err);
          this.errorMessage = err.error || "Une erreur est survenue lors de la modification";
        }
      });
    } else {
      this.rendezvousService.addRendezVous(this.rendezVous).subscribe({
        next: () => {
          this.toastr.success('Rendez-vous ajouté avec succès !');
          this.resetAndReload();
        },
        error: (err) => {
          console.error("Erreur ajout :", err);
          this.toastr.error('Erreur lors de l\'ajout.');
        }
      });
    }
  }

  private validateForm(): boolean {
    if (!this.rendezVous.dateHeure || !this.rendezVous.duree || !this.rendezVous.remarque) {
      alert("Veuillez remplir tous les champs obligatoires");
      return false;
    }
    return true;
  }

  editRendezVous(rdv: RendezVous): void {
    if (rdv.archived || rdv.statut !== StatutRendezVous.EN_COURS) {
      alert("Vous ne pouvez modifier que les rendez-vous avec le statut 'EN_COURS'");
      return;
    }

    this.rendezVous = JSON.parse(JSON.stringify(rdv));
    this.rendezVous.dateHeure = this.formatDateTimeLocal(this.rendezVous.dateHeure);
    this.editMode = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  resetForm(): RendezVous {
    const defaultDate = new Date();
    defaultDate.setHours(9, 0, 0, 0);
    const newRdv: Partial<RendezVous> = {
      dateHeure: this.formatDateTimeLocal(defaultDate),
      duree: 30,
      remarque: '',
      statut: StatutRendezVous.EN_COURS,
      archived: false,
      rappel: true
    };
    return newRdv as RendezVous;
  }

  resetAndReload(): void {
    this.rendezVous = this.resetForm();
    this.editMode = false;
    this.loadAllRendezVous();
  }

  formatDateTimeLocal(dateStr: string | Date): string {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  getStatutLabel(statut: StatutRendezVous): string {
    switch (statut) {
      case StatutRendezVous.EN_COURS: return 'En cours';
      case StatutRendezVous.ACCEPTE: return 'Accepté';
      case StatutRendezVous.REFUSE: return 'Refusé';
      default: return statut;
    }
  }

  hasRendezVousEnCours(): boolean {
    return this.allRendezVous.some(rdv => rdv.statut === StatutRendezVous.EN_COURS);
  }

  navigateTodossier(): void {
    this.router.navigate(['/dossier-medical']).then(() => {
      console.log('Navigation vers dossier médical réussie');
    }).catch(err => {
      console.error('Erreur de navigation:', err);
      this.toastr.error('Impossible d\'accéder au dossier médical', 'Erreur');
    });
  }
}