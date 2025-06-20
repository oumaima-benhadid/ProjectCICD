// src/app/components/ajout-reclamation/ajout-reclamation.component.ts

import { Component } from '@angular/core';
import { ReclamationService } from '../../services/reclamation.service';
import { TypeReclamation, ReclamationRequest } from '../../models/reclamation.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-ajout-reclamation',
  templateUrl: './ajout-reclamation.component.html',
  styleUrls: ['./ajout-reclamation.component.css']
})
export class AjoutReclamationComponent {
  form: ReclamationRequest = {
    typeReclamation: TypeReclamation.Activite_Sportive,
    description: ''
  };
  
  mesReclamations: any[] = [];
  seancesDisponibles: any[] = [];
evenementsDisponibles: any[] = [];
now: Date = new Date();


  successMsg = '';
  errorMsg = '';

  constructor(private reclamationService: ReclamationService, private toastr: ToastrService) {}
  loading = false;

  ngOnInit(): void {
    this.loadMesReclamations();
    this.loadSeancesDisponibles();
    this.loadEvenementsDisponibles();
    }
    loadSeancesDisponibles(): void {
      this.reclamationService.getMesSeances().subscribe({
        next: (data) => this.seancesDisponibles = data,
        error: (err) => console.error('Erreur chargement séances', err)
      });
    }
    
    loadEvenementsDisponibles(): void {
      this.reclamationService.getMesEvenements().subscribe({
        next: (data) => {
          console.log('Événements récupérés:', data);
          this.evenementsDisponibles = data;
        },
        error: (err) => console.error('Erreur chargement événements', err)
      });
    }
    
    
  loadMesReclamations(): void {
    this.reclamationService.getMyReclamations().subscribe({
      next: (data) => this.mesReclamations = data,
      error: (err) => console.error('Erreur lors du chargement des réclamations perso', err)
    });
  }
  getDaysBetween(start: Date, end: Date): number {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
  getEvenementById(id: number): any {
    return this.evenementsDisponibles.find(event => event.idEvenement === id);
  }
  
  
  submitForm(): void {
    this.loading = true;
    this.reclamationService.addReclamation(this.form).subscribe({
      next: () => {
        this.successMsg = '✅ Réclamation ajoutée avec succès.';
        this.errorMsg = '';
        this.form = {
          typeReclamation: TypeReclamation.Activite_Sportive,
          description: ''
        };
        this.loadMesReclamations();
        this.loading = false;
      },
      error: err => {
        const message = err.error?.message || '';
      
        if (message.includes('toxique')) {
          this.toastr.error('❌ Veuillez reformuler votre description sans langage inapproprié.');
        } else {
          this.toastr.error(message ? '❌ Erreur : ' + message : '❌ Veuillez reformuler votre description sans langage inapproprié');
        }
      
        this.loading = false;
      }
                });
  }
  
}