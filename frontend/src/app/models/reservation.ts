export enum ReservationStatus {
  CONFIRMEE = 'CONFIRMEE',
  EN_ATTENTE = 'EN_ATTENTE',
  ANNULEE = 'ANNULEE'
}

export interface Reservation {
  id_reservation: number;
  status: ReservationStatus;
  dateReservation: Date;
  seance: {
    activite: {
      nomActivite: string;
    };
    dateSeance: string;
    heureDebut: string;
    heureFin: string;

    lieu: string;
  };
  user: {
    nom: string;
    prenom: string;
  };
}
