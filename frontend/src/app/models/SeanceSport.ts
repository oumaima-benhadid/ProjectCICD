export interface SeanceSport {
 id?: number;
 dateSeance: string; // Format ISO pour la date, ex: "2023-10-01"
 // `?` car il est généré automatiquement
  heureDebut: string; // Format ISO pour l'heure, ex: "14:00:00"
  heureFin: string;
  capaciteDispo: number;
  lieu: string;
  activite?: any; // Optionnel si tu ne gères pas les relations côté client pour l'instant
}
