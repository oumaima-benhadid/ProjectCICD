import { SeanceSport } from "./SeanceSport";

export interface Activite {
  id: number;
  nomActivite: string;
  description?: string;
  image?: string;
  statutActivite: StatutActivite;
  seance_sports?: SeanceSport[]; // Liste de séances
  nbReservationsSemaine?: number; // Optionnel


}

export enum StatutActivite {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',

}
