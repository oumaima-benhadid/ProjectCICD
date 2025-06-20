export enum TypeReclamation {
  Activite_Sportive = 'Activite_Sportive',
  Evenement = 'Evenement',
}


export enum StatutReclamation {
  En_Cours = 'En_Cours',
  Résolue = 'Résolue',
  Non_Résolue = 'Non_Résolue',
}


export interface ReclamationRequest {
  typeReclamation: TypeReclamation;
  description: string;
  idUser?: number;
  dateReclamation?: Date;
  statut?: StatutReclamation;
  dateResolution?: Date;
  idSeanceSport?: number;
idEvenement?: number;

}

export interface Reclamation {
  id: number;
  typeReclamation: TypeReclamation;
  description: string;
  dateReclamation: Date;
  statut: StatutReclamation;
  dateResolution?: Date;
  archived: boolean;
  nomUtilisateur?: string;

  user?: {
    id: number;
    email: string;
    nom?: string;
    prenom?: string;
  };

}

export interface ReclamationResponseDTO {
  id: number;
  nomUtilisateur: string;
  typeReclamation: string;
  description: string;
  dateReclamation: Date;
  statut: string;
  idSeanceSport?: number;
  idEvenement?: number;

}