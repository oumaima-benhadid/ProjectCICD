import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Activite } from 'src/app/models/activite';
import { ActiviteServiceService } from 'src/app/services/activite-service.service';
import { AuthService } from 'src/app/services/auth.service';
import { IaServiceService } from 'src/app/services/ia-service.service';

@Component({
  selector: 'app-activites',
  templateUrl: './activites.component.html',
  styleUrls: ['./activites.component.css']
})
export class ActivitesComponent {
  activites: Activite[] = [];
  message: string | null = null;
  imageUrls: { [id: number]: string } = {};
  activiteTop?: Activite; // activité avec le plus de réservations
  activiteTopId: number | null = null;
  planningIA: any[] = [];
  userId!: number; // ✅

  constructor(private iaService: IaServiceService ,private activiteService: ActiviteServiceService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private toastr: ToastrService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.http.get<Activite[]>('http://fitmind.local:30080/PIdev/activites/tendance')
  .subscribe({
    next: (data) => {
      if (!data || data.length === 0) {
        this.activites = [];
        this.activiteTopId = null;
        return;
      }

      // data est déjà trié par le backend, on garde tel quel
      this.activites = data;
      this.activiteTopId = data[0].id; // le top 1 est en premier
        this.activites.forEach(act => {
          this.imageUrls[act.id] = `http://fitmind.local:30080/PIdev/activites/image/${act.id}`;
        });
      },
      error: (err) => {
        console.error('Erreur lors du chargement des activités', err);
      }
    });


    this.route.queryParams.subscribe(params => {
      const reservationId = params['reservationId'];
      if (reservationId) {
        console.log("📦 ID de réservation reçu :", reservationId);
        this.http.put(`http://fitmind.local:30080/PIdev/reservations/confirm-reservation/${reservationId}`, null)
          .subscribe({
            next: () => {
              this.message = "✅ Votre réservation a été confirmée avec succès.";
              this.router.navigate(['/etudiant/activite']);
            },
          });
      }
    });

    this.authService.getCurrentUserFromApi().subscribe({
      next: (user) => {
        this.userId = user.id;
        console.log("✅ ID utilisateur depuis API /me :", this.userId);

        this.iaService.getPlanning(this.userId).subscribe({
          next: (planning) => {
            this.planningIA = planning;
            console.log("📅 Planning IA reçu :", this.planningIA);
            // tu peux construire ton calendarOptions ici
          },
          error: (err) => {
            console.error("❌ Erreur lors du chargement du planning :", err);
          }
        });
      },
    });
  }

afficherDetails(activite: Activite): void {
  this.router.navigate(['/seances', activite.id]); // Naviguer vers SeanceOffComponent
}
}
