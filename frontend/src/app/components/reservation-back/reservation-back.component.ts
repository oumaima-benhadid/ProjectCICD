import { Component } from '@angular/core';
import { Reservation } from 'src/app/models/reservation';
import { ReservationService } from 'src/app/services/reservation.service';

@Component({
  selector: 'app-reservation-back',
  templateUrl: './reservation-back.component.html',
  styleUrls: ['./reservation-back.component.css']
})
export class ReservationBackComponent {
  searchText: string = '';
  reservations: Reservation[] = [];
  pagedReservations: Reservation[] = [];
  filteredReservations: Reservation[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  constructor(private reservationService: ReservationService) {}


ngOnInit(): void {
  this.reservationService.getAllReservations().subscribe({
    next: (data) => {
      console.log('Réservations récupérées avec succès', data);
      this.reservations = data;
      this.updatePagedReservations();
    },
    error: (error) => {
      console.error('Erreur lors de la récupération des réservations', error);
    }
  });
}


filterReservations() {
  if (!this.searchText) {
    this.filteredReservations = this.reservations;
  } else {
    const searchLower = this.searchText.toLowerCase();
    this.filteredReservations = this.reservations.filter(reservation =>
      (reservation.user?.prenom?.toLowerCase().includes(searchLower) ||
       reservation.user?.nom?.toLowerCase().includes(searchLower) ||
       reservation.seance?.activite?.nomActivite?.toLowerCase().includes(searchLower))
    );
  }
  this.currentPage = 1; // reset to first page
  this.updateReservations();
}

updateReservations() {
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  const endIndex = startIndex + this.itemsPerPage;
  this.pagedReservations = this.filteredReservations.slice(startIndex, endIndex);
}
updatePagedReservations() {
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  const endIndex = startIndex + this.itemsPerPage;
  this.pagedReservations = this.reservations.slice(startIndex, endIndex);
}

goToPage(page: number) {
  this.currentPage = page;
  this.updatePagedReservations();
}}
