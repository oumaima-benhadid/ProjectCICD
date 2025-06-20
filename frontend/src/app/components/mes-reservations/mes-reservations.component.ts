import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Reservation, ReservationStatus } from '../../models/reservation';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-mes-reservations',
  templateUrl: './mes-reservations.component.html',
  styleUrls: ['./mes-reservations.component.css']
})
export class MesReservationsComponent implements OnInit {
  reservations: Reservation[] = [];
  userId!: number;
  statusEnum = ReservationStatus;
  currentPage = 1;
  itemsPerPage = 6;
  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.authService.getCurrentUserFromApi().subscribe({
      next: (user) => {
        this.userId = user.id;
        console.log("✅ ID utilisateur depuis API /me :", this.userId);
        this.getReservationsByUser();
      },
      error: (err) => {
        console.error("❌ Erreur lors de la récupération de l'utilisateur connecté :", err);
        this.toastr.error("Utilisateur non authentifié", "Erreur");
      }
    });

  }
  paginatedReservations(): Reservation[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.reservations.slice(start, end);
  }

  // Passe à la page suivante
  nextPage(): void {
    if (this.currentPage < this.totalPages()) {
      this.currentPage++;
    }
  }

  // Passe à la page précédente
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  // Aller directement à une page
  goToPage(page: number): void {
    this.currentPage = page;
  }

  // Nombre total de pages
  totalPages(): number {
    return Math.ceil(this.reservations.length / this.itemsPerPage);
  }

  // Tableau des numéros de pages [1, 2, 3, ..., n]
  pagesArray(): number[] {
    return Array(this.totalPages()).fill(0).map((x, i) => i + 1);
  }
  getReservationsByUser(): void {
    this.http.get<Reservation[]>(
      `http://localhost:8081/PIdev/reservations/user/${this.userId}`,
      { headers: this.getHeaders() }
    ).subscribe({
      next: (data) => {
        console.log("📥 Réservations récupérées :", data);
        const order = {
          CONFIRMEE: 1,
          EN_ATTENTE: 2,
          ANNULEE: 3
        };
        this.reservations = data.sort((a, b) => order[a.status] - order[b.status]);
      },
      error: (err) => {
        console.error("❌ Erreur lors de la récupération des réservations :", err);
        this.toastr.error("Impossible de charger vos réservations.");
      }
    });
}
  getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
  annulerReservation(reservationId: number): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Voulez-vous vraiment annuler cette réservation ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, annuler',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(
          `http://localhost:8081/PIdev/reservations/annuler/${reservationId}`,
          { responseType: 'text' as 'json', headers: this.getHeaders() }
        ).subscribe({
          next: () => {
            this.reservations = this.reservations.map(r =>
              r.id_reservation === reservationId
                ? { ...r, status: this.statusEnum.ANNULEE }
                : r
            );
            Swal.fire('Annulée !', 'Votre réservation a été annulée.', 'success');
            this.toastr.success('Réservation annulée ✅');
          },
          error: (err) => {
            console.error('Erreur lors de l\'annulation', err);
            this.toastr.error('Erreur lors de l’annulation');
            Swal.fire('Erreur', 'Impossible d\'annuler la réservation.', 'error');
          }
        });
      }
    });
  }

  telechargerPDF(): void {
    const doc = new jsPDF();
    const marginX = 15;
    let y = 30;

    doc.setFillColor(30, 144, 255);
    doc.rect(0, 0, 210, 20, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(255);
    doc.text('Mes Réservations Sportives', 105, 13, { align: 'center' });

    doc.setFontSize(10);
    doc.setTextColor(90);
    doc.text(`Généré le : ${new Date().toLocaleString()}`, marginX, y);
    y += 10;

    this.reservations.forEach((res: any) => {
      const date = new Date(res.seance.dateSeance).toLocaleDateString();
      const heureDebut = res.seance.heureDebut || '--:--';
      const lieu = res.seance.lieu || 'N/A';
      const statut = res.status || '--';
      const activite = res.seance.activite.nomActivite;

      doc.setFillColor(245, 245, 245);
      doc.roundedRect(marginX, y, 180, 40, 4, 4, 'F');

      let innerY = y + 10;
      doc.setTextColor(0);

      doc.text(`Date: ${date}`, marginX + 5, innerY);
      innerY += 7;
      doc.text(`Heure: ${heureDebut}`, marginX + 5, innerY);
      innerY += 7;
      doc.text(`Lieu: ${lieu}`, marginX + 5, innerY);
      innerY += 7;
      doc.text(`Statut: ${statut}`, marginX + 5, innerY);
      innerY += 7;
      doc.text(`Activité: ${activite}`, marginX + 5, innerY);

      y += 50;
      if (y > 260) {
        doc.addPage();
        y = 30;
      }
    });

    doc.save('mes-reservations.pdf');
  }





}
