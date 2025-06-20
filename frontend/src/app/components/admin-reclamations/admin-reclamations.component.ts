import { Component, OnInit } from '@angular/core';
import { ReclamationService } from '../../services/reclamation.service';
import { Reclamation, StatutReclamation , ReclamationResponseDTO} from '../../models/reclamation.model';

@Component({
  selector: 'app-admin-reclamations',
  templateUrl: './admin-reclamations.component.html',
  styleUrls: ['./admin-reclamations.component.css']
})
export class AdminReclamationsComponent implements OnInit {
  statutOptions = Object.values(StatutReclamation);
  reclamations: Reclamation[] = [];

  constructor(private reclamationService: ReclamationService) {}

  ngOnInit(): void {
    this.loadReclamations();
  }

  loadReclamations(): void {
    this.reclamationService.getAll().subscribe({
      next: data => this.reclamations = data,
      error: err => console.error('Erreur de chargement des réclamations :', err)
    });
  }

  updateStatut(id: number, statut: StatutReclamation): void {
    this.reclamationService.updateReclamation(id, {
      statut,
      dateResolution: new Date()
    }).subscribe(() => this.loadReclamations());
  }
  archiveReclamation(r: Reclamation): void {
    this.reclamationService.archive(r.id).subscribe(() => {
      r.archived = true; // 👈 on met à jour localement sans recharger
    });
  }
  
  restoreReclamation(r: Reclamation): void {
    this.reclamationService.restore(r.id).subscribe(() => {
      r.archived = false;
    });
  }
  
  
}
