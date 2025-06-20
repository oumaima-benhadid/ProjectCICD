export interface RendezVous {
  idRendezVous: number; // ID du rendez-vous, optionnel pour les nouveaux rendez-vous
  dateHeure: string;
  duree: number;
  remarque: string;
  etudiant: { idUser: number };
  nutritioniste: { idUser: number };
  statut: StatutRendezVous; // ⚠️ utilise l'enum ici
  archived: boolean;
  rappel: boolean;
}


export enum StatutRendezVous {
  EN_COURS = 'EN_COURS',
  ACCEPTE = 'ACCEPTE',
  REFUSE = 'REFUSE'
}
export interface AddRendezVousResponse {
  message: string;
  rendezVous: RendezVous;
}
