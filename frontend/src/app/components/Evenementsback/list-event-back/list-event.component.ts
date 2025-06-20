import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-list-event',
  templateUrl: './list-event.component.html',
  styleUrls: ['./list-event.component.css']
})
export class ListEventComponent implements OnInit {
  p: number = 1;
  SearchText: string = '';
  control: FormControl = new FormControl('');
  showForm: boolean = false;
  selectedItem: any = null;
  selectedEventId: number | null = null;
  inscriptions: any[] = [];
  filteredInscriptions: any[] = [];
  showInscriptions: boolean = false;
  isLoading: boolean = false;
  
  // Nouveaux filtres
  filterStatus: string = 'ALL';
  filterType: string = '';
  inscriptionStatusFilter: string = 'ALL';
  
  // Liste des types d'événements
  eventTypes: string[] = [];

  constructor(
    public service: EventService,
    public toastr: ToastrService,
    private router: Router,
    public fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.isLoading = true;
    this.service.getAll().subscribe({
      next: response => {
        this.service.list = response;
        this.extractEventTypes();
        this.isLoading = false;
      },
      error: error => {
        console.error('Erreur lors de la récupération des événements :', error);
        this.toastr.error('Impossible de charger les événements', 'Erreur');
        this.isLoading = false;
      }
    });
  }

  // Extraire les types d'événements uniques pour le filtre
  extractEventTypes(): void {
    this.eventTypes = [...new Set(this.service.list.map(item => item.typeEvenement))];
  }

  filteredList(): any[] {
    const query = this.SearchText.toLowerCase();
  
    return this.service.list
      .filter(item => {
        // Filtre par texte
        const matchesText = item.titre?.toLowerCase().includes(query);
        
        // Filtre par état
        const matchesStatus = this.filterStatus === 'ALL' || item.etatEvent === this.filterStatus;
        
        // Filtre par type
        const matchesType = !this.filterType || item.typeEvenement === this.filterType;
        
        return matchesText && matchesStatus && matchesType;
      })
      .sort((a, b) => {
        const priority = (etat: string): number => {
          switch (etat) {
            case 'EN_COURS': return 0;
            case 'A_VENIR': return 1;
            default: return 2; // PASSE
          }
        };
  
        const prioA = priority(a.etatEvent);
        const prioB = priority(b.etatEvent);
  
        if (prioA !== prioB) return prioA - prioB;
  
        // Si tous les deux sont A_VENIR, trier par date proche
        if (a.etatEvent === 'A_VENIR' && b.etatEvent === 'A_VENIR') {
          return new Date(a.dateEvenement).getTime() - new Date(b.dateEvenement).getTime();
        }
  
        return 0;
      });
  }
  
  toggleForm(): void {
    this.service.choixmenu = 'A';
    this.initForm();
    this.showForm = true;
  }

  editForm(item: any): void {
    if (item.etatEvent !== 'A_VENIR') {
      this.toastr.warning("Vous ne pouvez modifier que les événements à venir.");
      return;
    }
  
    this.service.choixmenu = 'M';
    this.selectedItem = item;
  
    this.service.formData = this.fb.group({
      idEvenement: [item.idEvenement],
      titre: [item.titre, [Validators.required, Validators.minLength(3)]],
      description: [item.description, [Validators.required, Validators.minLength(10)]],
      dateEvenement: [this.formatDateForInput(item.dateEvenement), Validators.required],
      dateFin: [this.formatDateForInput(item.dateFin), Validators.required],
      lieu: [item.lieu, Validators.required],
      capaciteMax: [item.capaciteMax, [Validators.required, Validators.min(1)]],
      typeEvenement: [item.typeEvenement, Validators.required]
    }, {
      validators: this.dateInFutureValidator
    });
  
    this.showForm = true;
  }
  
  // Format date for datetime-local input
  formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  }

  closeForm(): void {
    this.showForm = false;
    this.selectedItem = null;
    // Refresh data after form close
    this.getData();
  }

  initForm(item?: any): void {
    let dateEventValue = '';
    let dateFinValue = '';
    
    if (item?.dateEvenement) {
      dateEventValue = this.formatDateForInput(item.dateEvenement);
    }
    
    if (item?.dateFin) {
      dateFinValue = this.formatDateForInput(item.dateFin);
    }
    
    this.service.formData = this.fb.group({
      idEvenement: [item?.idEvenement || null],
      titre: [item?.titre || '', [Validators.required, Validators.minLength(3)]],
      description: [item?.description || '', [Validators.required, Validators.minLength(10)]],
      dateEvenement: [dateEventValue, [Validators.required]], 
      dateFin: [dateFinValue, [Validators.required]],
      lieu: [item?.lieu || '', [Validators.required]],
      capaciteMax: [item?.capaciteMax || '', [Validators.required, Validators.min(1)]],
      typeEvenement: [item?.typeEvenement || '', Validators.required]
    }, {
      validators: [this.dateRangeValidator, this.dateInFutureValidator]
    });
  }
  
  removeData(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cet événement ?')) {
      this.isLoading = true;
      this.service.deleteData(id).subscribe({
        next: () => {
          this.toastr.warning('Événement supprimé avec succès !');
          this.getData();
          this.isLoading = false;
        },
        error: err => {
          console.error('Erreur lors de la suppression :', err);
          this.toastr.error('Erreur lors de la suppression', 'Erreur');
          this.isLoading = false;
        }
      });
    }
  }
  
  // Validation de la date future
  dateInFutureValidator(control: AbstractControl): ValidationErrors | null {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dateEvent = control.get('dateEvenement');
    if (!dateEvent || !dateEvent.value) return null;
    
    const inputDate = new Date(dateEvent.value);
    return inputDate < today ? { pastDate: true } : null;
  }
  
  // Validation pour s'assurer que la date de fin est après la date de début
  dateRangeValidator(control: AbstractControl): ValidationErrors | null {
    const dateEvent = control.get('dateEvenement');
    const dateFin = control.get('dateFin');
    
    if (!dateEvent || !dateFin || !dateEvent.value || !dateFin.value) return null;
    
    const start = new Date(dateEvent.value);
    const end = new Date(dateFin.value);
    
    return end <= start ? { invalidDateRange: true } : null;
  }
  
  viewInscriptions(eventId: number): void {
    this.selectedEventId = eventId;
    this.isLoading = true;
    this.showInscriptions = true;
    this.inscriptionStatusFilter = 'ALL';
    
    this.service.getInscriptionsByEvent(eventId).subscribe({
      next: (response: any) => {
        this.inscriptions = response;
        this.applyInscriptionFilter(); // Appliquer le filtre par défaut
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des inscriptions:', error);
        this.toastr.error('Impossible de récupérer les inscriptions');
        this.isLoading = false;
        this.closeInscriptions();
      }
    });
  }
  
  applyInscriptionFilter(): void {
    if (this.inscriptionStatusFilter === 'ALL') {
      this.filteredInscriptions = [...this.inscriptions];
    } else {
      this.filteredInscriptions = this.inscriptions.filter(
        inscription => inscription.statutInscription === this.inscriptionStatusFilter
      );
    }
  }
  
  closeInscriptions(): void {
    this.showInscriptions = false;
    this.selectedEventId = null;
    this.inscriptions = [];
    this.filteredInscriptions = [];
  }
  
  // Nouvelle méthode pour mettre à jour le statut d'une inscription
  updateInscriptionStatus(inscriptionId: number, newStatus: string): void {
    if (!confirm(`Êtes-vous sûr de vouloir ${newStatus === 'CONFIRMEE' ? 'confirmer' : 'annuler'} cette inscription ?`)) {
      return;
    }
    
    this.isLoading = true;
    
    this.service.updateInscriptionStatus(inscriptionId, newStatus).subscribe({
      next: (response) => {
        this.toastr.success(`Inscription ${newStatus === 'CONFIRMEE' ? 'confirmée' : 'annulée'} avec succès !`);
        
        // Mettre à jour le statut localement
        const index = this.inscriptions.findIndex(item => item.idInscription === inscriptionId);
        if (index !== -1) {
          this.inscriptions[index].statutInscription = newStatus;
          this.applyInscriptionFilter(); // Réappliquer le filtre
        }
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour du statut:', error);
        this.toastr.error('Erreur lors de la mise à jour du statut');
        this.isLoading = false;
      }
    });
  }
  
  // Méthode pour réinitialiser tous les filtres
  resetFilters(): void {
    this.SearchText = '';
    this.filterStatus = 'ALL';
    this.filterType = '';
    this.p = 1;
  }
  isEventEditable(): boolean {
    const event = this.service.list.find(e => e.idEvenement === this.selectedEventId);
    return event && event.etatEvent === 'A_VENIR';
  }
  
}