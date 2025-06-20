import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';
import { AuthService } from 'src/app/services/auth.service';

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'assets/leaflet/images/marker-icon-2x.png',
  iconUrl: 'assets/leaflet/images/marker-icon.png',
  shadowUrl: 'assets/leaflet/images/marker-shadow.png',
});
interface TypeStat {
  type: string;
  count: number;
  percentage: number;
}

@Component({
  selector: 'app-evenement-user',
  templateUrl: './evenement-user.component.html',
  styleUrls: ['./evenement-user.component.css']
})
export class EvenementUserComponent implements OnInit {
  events: any[] = [];
  searchText: string = '';
  userId!: number;
  inscriptions: Set<number> = new Set();
  lieuAffiche: string | null = null;
  hover: boolean = false;
  typeStats: TypeStat[] = [];
  totalInscriptions: number = 0;
  Math = Math;
  currentDate: Date = new Date();
selectedDay: number | null = null;
eventPopupVisible: boolean = false;
eventWithMapOpen: number | null = null;
evenementCarteId: number | null = null; // Pour stocker l'ID de l'événement dont on affiche la carte
private currentMap: any = null;
private resizeObserver: ResizeObserver | null = null;
inscriptionStatuses: Map<number, string> = new Map();
inscriptionIds: Map<number, number> = new Map(); // Map eventId -> inscriptionId
selectedQRCodeUrl: string | null = null;
showQRCodeModal: boolean = false;
recommendedEvents: any[] = [];



  constructor(
    private eventService: EventService,
    private toastr: ToastrService,
    private http: HttpClient ,
    private authService: AuthService // <== AJOUTE CECI

  ) {}
  ngOnInit(): void {
    const decodedToken = this.authService.getDecodedToken();
    if (decodedToken && decodedToken.id) {
      this.userId = decodedToken.id;
      console.log("✅ ID utilisateur connecté :", this.userId);
    } else {
      console.error("❌ Impossible de récupérer l'ID utilisateur connecté");
    }
  
    this.loadEvents();
    this.loadRecommendations();
  }
  

  loadEvents(): void {
    this.eventService.getAll().subscribe((data) => {
      this.events = data;
      this.inscriptions.clear();
      this.inscriptionStatuses.clear();
      this.inscriptionIds.clear();
      
      data.forEach((event: any) => {
        event.inscriptions?.forEach((inscription: any) => {
          if (inscription.idUser === this.userId) {  // ✅ Correct ici maintenant
            this.inscriptions.add(event.idEvenement);
            this.inscriptionStatuses.set(event.idEvenement, inscription.statutInscription);
            this.inscriptionIds.set(event.idEvenement, inscription.idInscription);
          }
        });
      });
  
      this.calculateTypeStats();
    });
  }
  

  calculateTypeStats(): void {
    // Réinitialiser les statistiques
    this.typeStats = [];
    const typeCounts: Record<string, number> = {};
    this.totalInscriptions = 0;
    
    // Compter les inscriptions par type d'événement
    this.events.forEach(event => {
      if (this.estInscrit(event.idEvenement)) {
        this.totalInscriptions++;
        
        const type = event.typeEvenement || 'Non catégorisé';
        typeCounts[type] = (typeCounts[type] || 0) + 1;
      }
    });
    
    // Calculer les pourcentages
    if (this.totalInscriptions > 0) {
      for (const [type, count] of Object.entries(typeCounts)) {
        this.typeStats.push({
          type,
          count,
          percentage: Math.round((count / this.totalInscriptions) * 100)
        });
      }
      
      // Trier par nombre d'inscriptions (décroissant)
      this.typeStats.sort((a, b) => b.count - a.count);
    }
  }

  filteredEvents(): any[] {
    const query = this.searchText.toLowerCase();
    const ordre: Record<string, number> = {
      'A_VENIR': 0,
      'EN_COURS': 1,
      'PASSE': 2
    };
  
    return this.events
      .filter(event => event.titre?.toLowerCase().includes(query))
      .sort((a, b) => {
        const ordreDiff = ordre[a.etatEvent] - ordre[b.etatEvent];
        if (ordreDiff !== 0) return ordreDiff;
  
        // Si même état, trier les "A_VENIR" par date de début
        if (a.etatEvent === 'A_VENIR' && b.etatEvent === 'A_VENIR') {
          return new Date(a.dateEvenement).getTime() - new Date(b.dateEvenement).getTime();
        }
  
        // Pour les autres, garder l'ordre tel quel
        return 0;
      });
  }
  
  getEventsByType(type: string): any[] {
    // Filtrer les événements par type et appliquer la recherche
    return this.events.filter(event => 
      event.etatEvent === type && 
      (!this.searchText || event.titre?.toLowerCase().includes(this.searchText.toLowerCase()))
    );
  }
  
  inscrire(idEvenement: number): void {
    // Vérifier si l'événement est complet avant d'inscrire
    const event = this.events.find(e => e.idEvenement === idEvenement);
    if (event && this.isComplet(event)) {
      this.toastr.warning("Cet événement est complet, inscription impossible.");
      return;
    }
    
    // Vérifier si l'utilisateur est déjà inscrit
    const isAlreadyRegistered = this.estInscrit(idEvenement);
    const currentStatus = this.inscriptionStatuses.get(idEvenement);
    
    // Si déjà inscrit et statut confirmé, avertir l'utilisateur
    if (isAlreadyRegistered && currentStatus === 'CONFIRMEE') {
      this.toastr.info("Vous êtes déjà inscrit et confirmé pour cet événement.");
      return;
    }
    
    // Si déjà inscrit mais pas confirmé, annuler l'inscription existante et recréer une nouvelle
    if (isAlreadyRegistered) {
      // D'abord annuler l'inscription existante
      this.eventService.removeInscription(this.userId, idEvenement).subscribe({
        next: () => {
          // Puis créer une nouvelle inscription avec statut "EN_ATTENTE"
          this.createNewInscription(idEvenement);
        },
        error: (err) => {
          console.error(err);
          this.toastr.error("Erreur lors de la mise à jour de l'inscription");
        }
      });
    } else {
      // Si pas encore inscrit, créer une nouvelle inscription
      this.createNewInscription(idEvenement);
    }
  }
  
  // Méthode auxiliaire pour créer une nouvelle inscription
  private createNewInscription(idEvenement: number): void {
    const payload = {
      user: { idUser: this.userId },
      evenement: { idEvenement },
      dateInscription: new Date().toISOString(),
      statutInscription: 'EN_ATTENTE'
    };
  
    this.eventService.addInscription(payload).subscribe({
      next: () => {
        this.toastr.success("Inscription réussie !");
        this.inscriptions.add(idEvenement);
        this.inscriptionStatuses.set(idEvenement, 'EN_ATTENTE');
        
        // Mettre à jour l'événement dans la liste
        const event = this.events.find(e => e.idEvenement === idEvenement);
        if (event) {
          if (!event.inscriptions) event.inscriptions = [];
          event.inscriptions.push({ 
            user: { idUser: this.userId },
            statutInscription: 'EN_ATTENTE'
          });
        }
        
        // Recalculer les statistiques
        this.calculateTypeStats();
      },
      error: (err) => {
        console.error(err);
        this.toastr.error("Erreur lors de l'inscription");
      }
    });
  }

 
  isComplet(event: any): boolean {
    return (event.inscriptions?.length || 0) >= event.capaciteMax;
  }

  getCapaciteRestante(event: any): number {
    return event.capaciteMax - (event.inscriptions?.length || 0);
  }

  estInscrit(idEvenement: number): boolean {
    return this.inscriptions.has(idEvenement);
  }

  // Dans votre composant TypeScript
  openMap(lieu: string, idEvenement: number): void {
    this.lieuAffiche = lieu;
    this.evenementCarteId = idEvenement;
    
    // Use requestAnimationFrame instead of setTimeout for better performance
    requestAnimationFrame(() => {
      const mapId = 'map-container-' + idEvenement;
      const mapElement = document.getElementById(mapId);
      
      if (!mapElement) {
        console.error('Map container not found:', mapId);
        this.toastr.error("Conteneur de carte introuvable");
        return;
      }
      
      // Réinitialiser l'élément
      mapElement.innerHTML = '';
      
      // Observer pour s'assurer que le conteneur a des dimensions valides
      const checkSize = () => {
        if (mapElement.offsetWidth > 0 && mapElement.offsetHeight > 0) {
          this.loadMapData(lieu, mapId, mapElement);
        } else {
          // Attendre encore si les dimensions ne sont pas encore définies
          setTimeout(checkSize, 100);
        }
      };
      
      checkSize();
    });
  }
  
  private loadMapData(lieu: string, mapId: string, mapElement: HTMLElement): void {
    console.log('Geocoding address:', lieu);
    
    // Ajouter des paramètres et headers pour améliorer les résultats
    this.http.get<any[]>('https://nominatim.openstreetmap.org/search', {
      params: {
        format: 'json',
        q: lieu,
        limit: 1,
        addressdetails: 1
      },
      headers: {
        'User-Agent': 'YourApp/1.0' // Meilleure pratique pour Nominatim
      }
    }).subscribe({
      next: (results) => {
        if (results && results.length > 0) {
          const lat = parseFloat(results[0].lat);
          const lon = parseFloat(results[0].lon);
          
          console.log('Creating map with coordinates:', lat, lon);
          
          try {
            // Vérifier que Leaflet est disponible
            if (typeof L === 'undefined') {
              this.toastr.error("La bibliothèque Leaflet n'est pas chargée");
              return;
            }
            
            // Créer la carte avec des options améliorées
            const map = L.map(mapId, {
              center: [lat, lon],
              zoom: 14,
              scrollWheelZoom: false // Meilleure expérience dans un modal
            });
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '© OpenStreetMap contributors',
              maxZoom: 19
            }).addTo(map);
            
            L.marker([lat, lon]).addTo(map)
              .bindPopup(lieu)
              .openPopup();
            
            // Mettre à jour la carte et stocker l'instance
            map.invalidateSize();
            this.currentMap = map;
            
            // Utiliser un ResizeObserver pour détecter les changements de taille du conteneur
            if (window.ResizeObserver) {
              if (this.resizeObserver) {
                this.resizeObserver.disconnect();
              }
              
              this.resizeObserver = new ResizeObserver(() => {
                if (map && typeof map.invalidateSize === 'function') {
                  map.invalidateSize();
                }
              });
              
              this.resizeObserver.observe(mapElement);
            } else {
              // Fallback si ResizeObserver n'est pas disponible
              setTimeout(() => map.invalidateSize(), 300);
            }
          } catch (err) {
            console.error('Error creating map:', err);
            this.toastr.error("Erreur lors de la création de la carte");
          }
        } else {
          this.toastr.warning("Lieu introuvable sur la carte");
          console.error('No results found for location:', lieu);
        }
      },
      error: (err) => {
        console.error('Error geocoding address:', err);
        this.toastr.error("Erreur lors du chargement de la carte");
      }
    });
  }
  
  closeMap(): void {
    // Nettoyer proprement les ressources
    if (this.currentMap) {
      this.currentMap.remove(); // Détruire la carte correctement
      this.currentMap = null;
    }
    
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    
    this.lieuAffiche = null;
    this.evenementCarteId = null;
  }
  getDuree(event: any): string {
    const debut = new Date(event.dateEvenement);
    const fin = new Date(event.dateFin);
    const diffMs = fin.getTime() - debut.getTime();
  
    if (diffMs <= 0) return "Durée invalide";
  
    const diffMins = Math.floor(diffMs / 60000);
    const jours = Math.floor(diffMins / 1440);
    const heures = Math.floor((diffMins % 1440) / 60);
    const minutes = diffMins % 60;
  
    let texte = '';
    if (jours > 0) texte += `${jours}j `;
    if (heures > 0 || jours > 0) texte += `${heures}h `;
    texte += `${minutes}min`;
  
    return texte.trim();
  }
  getInscriptionHistory(): any[] {
    // Retourne tous les événements auxquels l'utilisateur est inscrit
    return this.events.filter(event => 
      this.estInscrit(event.idEvenement)
    ).sort((a, b) => new Date(b.dateEvenement).getTime() - new Date(a.dateEvenement).getTime());
  }
  getUpcomingEvents(): any[] {
    const now = new Date();
    const in48Hours = new Date(now.getTime() + 48 * 60 * 60 * 1000);
    
    return this.events.filter(event => {
      if (!this.estInscrit(event.idEvenement) || event.etatEvent !== 'A_VENIR') {
        return false;
      }
      
      const eventDate = new Date(event.dateEvenement);
      return eventDate >= now && eventDate <= in48Hours;
    }).sort((a, b) => new Date(a.dateEvenement).getTime() - new Date(b.dateEvenement).getTime());
  }
  
  // Méthode pour obtenir le délai en heures avant un événement
  getTimeUntilEvent(event: any): number {
    const now = new Date();
    const eventDate = new Date(event.dateEvenement);
    const diffMs = eventDate.getTime() - now.getTime();
    return Math.floor(diffMs / (1000 * 60 * 60));
  }
  prevMonth(): void {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() - 1,
      1
    );
  }
  
  nextMonth(): void {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1,
      1
    );
  }
  
  getDaysInMonth(): number[] {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const daysCount = new Date(year, month + 1, 0).getDate();
    
    return Array.from({ length: daysCount }, (_, i) => i + 1);
  }
  
  getFirstDayOffset(): number[] {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    
    return Array.from({ length: firstDay }, (_, i) => i);
  }
  
  isToday(day: number): boolean {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === this.currentDate.getMonth() &&
      today.getFullYear() === this.currentDate.getFullYear()
    );
  }
  
  hasEvent(day: number): boolean {
    return this.getEventsForDay(day).length > 0;
  }
  
  // Version corrigée de la méthode getEventsForDay
getEventsForDay(day: number | null): any[] {
  if (day === null) return [];
  
  const date = new Date(
    this.currentDate.getFullYear(),
    this.currentDate.getMonth(),
    day
  );
  
  // Filtrer les événements pour ce jour où l'utilisateur est inscrit
  return this.events.filter(event => {
    const eventDate = new Date(event.dateEvenement);
    return (
      eventDate.getDate() === date.getDate() &&
      eventDate.getMonth() === date.getMonth() &&
      eventDate.getFullYear() === date.getFullYear() &&
      this.estInscrit(event.idEvenement) &&
      event.etatEvent === 'A_VENIR'
    );
  });
}
  
  showEventPopup(day: number): void {
    if (this.hasEvent(day)) {
      this.selectedDay = day;
      this.eventPopupVisible = true;
    }
  }
  
  hideEventPopup(): void {
    this.eventPopupVisible = false;
  }
  
  getMyUpcomingEvents(): any[] {
    return this.events
      .filter(event => 
        event.etatEvent === 'A_VENIR' && 
        this.estInscrit(event.idEvenement)
      )
      .sort((a, b) => 
        new Date(a.dateEvenement).getTime() - new Date(b.dateEvenement).getTime()
      );
  }
  scrollEvents(containerId: string, direction: 'left' | 'right'): void {
    const container = document.getElementById(`${containerId}-events-container`);
    if (container) {
      const scrollAmount = 350; // Distance de défilement en px
      const scrollContainer = container.querySelector('.d-flex') as HTMLElement;
      
      if (scrollContainer) {
        if (direction === 'left') {
          scrollContainer.scrollLeft -= scrollAmount;
        } else {
          scrollContainer.scrollLeft += scrollAmount;
        }
      }
    }
  }
  getInscriptionStatus(eventId: number): string {
    return this.inscriptionStatuses.get(eventId) || 'NON_INSCRIT';
  }
  
  // Method to check if inscription is confirmed
  isInscriptionConfirmed(eventId: number): boolean {
    return this.inscriptionStatuses.get(eventId) === 'CONFIRMEE';
  }
  
  // Method to check if inscription is pending
  isInscriptionPending(eventId: number): boolean {
    return this.inscriptionStatuses.get(eventId) === 'EN_ATTENTE';
  }
  // Méthode pour obtenir le texte de statut
getStatusText(eventId: number): string {
  const status = this.getInscriptionStatus(eventId);
  switch(status) {
    case 'CONFIRMEE': return 'Confirmé';
    case 'EN_ATTENTE': return 'En attente';
    case 'REJETEE': return 'Rejeté';
    default: return 'En attente';
  }
}

// Méthode pour obtenir l'icône de statut
getStatusIcon(eventId: number): string {
  const status = this.getInscriptionStatus(eventId);
  switch(status) {
    case 'CONFIRMEE': return 'fas fa-check-circle';
    case 'EN_ATTENTE': return 'fas fa-clock';
    case 'REJETEE': return 'fas fa-times-circle';
    default: return 'fas fa-question-circle';
  }
}

// Méthode pour vérifier si l'inscription est rejetée
isInscriptionRejected(eventId: number): boolean {
  return this.inscriptionStatuses.get(eventId) === 'REJETEE';
}
generateAndDownloadQRCode(eventId: number): void {
  const inscriptionId = this.inscriptionIds.get(eventId);
  
  if (!inscriptionId) {
    this.toastr.error('ID d\'inscription introuvable');
    return;
  }
  
  this.eventService.generateQRCode(inscriptionId).subscribe({
    next: (response) => {
      this.toastr.success('QR Code généré avec succès!');

      // ✅ Marquer en local que QR code est généré
      const event = this.events.find(e => e.idEvenement === eventId);
      if (event) {
        const inscription = event.inscriptions?.find((i: any) => i.user?.idUser === this.userId);
        if (inscription) {
          inscription.qrCodeGenerated = true;
        }
      }

      // ✅ Télécharger directement le billet
      this.downloadTicket(eventId);

      // ✅ Ouvrir directement le QR code
      this.openQRCodeModal(eventId);
    },
    error: (err) => {
      console.error(err);
      this.toastr.error('Erreur lors de la génération du QR Code');
    }
  });
}


// Méthode pour télécharger uniquement le QR code
downloadQRCodeOnly(eventId: number): void {
  const inscriptionId = this.inscriptionIds.get(eventId);
  
  if (!inscriptionId) {
    this.toastr.error('ID d\'inscription introuvable');
    return;
  }
  
  this.eventService.downloadQRCode(inscriptionId).subscribe({
    next: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `qrcode_event_${eventId}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    },
    error: (err) => {
      console.error(err);
      this.toastr.error('Erreur lors du téléchargement du QR Code');
    }
  });
}

// Méthode pour télécharger le billet PDF
downloadTicket(eventId: number): void {
  const inscriptionId = this.inscriptionIds.get(eventId);
  
  if (!inscriptionId) {
    this.toastr.error('ID d\'inscription introuvable');
    return;
  }
  
  this.eventService.downloadTicket(inscriptionId).subscribe({
    next: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ticket_event_${eventId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    },
    error: (err) => {
      console.error(err);
      this.toastr.error('Erreur lors du téléchargement du billet');
    }
  });
}

// Vérifier si le QR code a été généré pour cette inscription
hasQRCodeGenerated(eventId: number): boolean {
  const inscriptionId = this.inscriptionIds.get(eventId);
  if (!inscriptionId) return false;
  
  const event = this.events.find(e => e.idEvenement === eventId);
  if (!event) return false;
  
  const inscription = event.inscriptions?.find((i: any) => i.user?.idUser === this.userId);
  return inscription && inscription.qrCodeGenerated;
}

// Annuler l'inscription avec vérification supplémentaire
annulerInscription(idEvenement: number): void {
  const inscriptionId = this.inscriptionIds.get(idEvenement);
  
  if (!inscriptionId) {
    this.toastr.error('ID d\'inscription introuvable');
    return;
  }
  
  // Vérifier d'abord si l'annulation est possible
  this.eventService.canCancelInscription(inscriptionId).subscribe({
    next: (canCancel) => {
      if (canCancel) {
        // L'annulation est possible
        this.eventService.removeInscription(this.userId, idEvenement).subscribe({
          next: () => {
            this.toastr.info('Inscription annulée.');
            this.inscriptions.delete(idEvenement);
            this.inscriptionIds.delete(idEvenement);
            
            // Mettre à jour le nombre d'inscriptions pour l'événement
            const event = this.events.find(e => e.idEvenement === idEvenement);
            if (event && event.inscriptions) {
              event.inscriptions = event.inscriptions.filter((i: any) => 
                i.user?.idUser !== this.userId
              );
            }
            
            // Recalculer les statistiques
            this.calculateTypeStats();
          },
          error: (err) => {
            console.error(err);
            this.toastr.error("Erreur lors de l'annulation");
          }
        });
      } else {
        // L'annulation n'est pas possible car le QR code a été généré
        this.toastr.warning('Impossible d\'annuler l\'inscription : le QR code a déjà été généré');
      }
    },
    error: (err) => {
      console.error(err);
      this.toastr.error('Erreur lors de la vérification de l\'annulation');
    }
  });
}
openQRCodeModal(eventId: number): void {
  const inscriptionId = this.inscriptionIds.get(eventId);
  if (!inscriptionId) {
    this.toastr.error("ID d'inscription introuvable");
    return;
  }

  // Précharger l'image en utilisant le service
  this.eventService.downloadQRCode(inscriptionId).subscribe({
    next: (blob) => {
      // Créer une URL à partir du blob
      this.selectedQRCodeUrl = URL.createObjectURL(blob);
      this.showQRCodeModal = true;
    },
    error: (err) => {
      console.error(err);
      this.toastr.error("Erreur lors du chargement du QR Code");
    }
  });
}

// N'oubliez pas de libérer l'URL du blob quand vous fermez la modal
closeQRCodeModal(): void {
  if (this.selectedQRCodeUrl && this.selectedQRCodeUrl.startsWith('blob:')) {
    URL.revokeObjectURL(this.selectedQRCodeUrl);
  }
  this.showQRCodeModal = false;
  this.selectedQRCodeUrl = null;
}
loadRecommendations(): void {
  this.eventService.getRecommendations(this.userId).subscribe({
    next: (res) => {
      console.log("🔥 Recommandations reçues:", res); // <== AJOUTEZ CECI
      this.recommendedEvents = res;
    },
    error: (err) => {
      console.error("❌ Erreur lors de la récupération des recommandations", err);
    }
  });
}
getBadgeClass(type: string): string {
  switch (type) {
    case 'SPORTIF':
      return 'bg-danger';
    case 'CONFERENCE':
      return 'bg-info';
    case 'SOIREE':
      return 'bg-warning text-dark';
    case 'ATELIER':
      return 'bg-success';
    case 'FORMATION':
      return 'bg-primary';
    case 'VOLONTARIAT':
      return 'bg-warning text-dark';
    default:
      return 'bg-dark text-white'; // Pour tous les autres types non prévus
  }
}


}

