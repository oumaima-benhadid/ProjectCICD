export interface User {
  idUser: number;
  role?: string;
}

export type GroupSanguin = 'A_NEG' | 'A_POS' | 'B_NEG' | 'B_POS' | 'AB_NEG' | 'AB_POS' | 'O_NEG' | 'O_POS';

export type Allergie =
  | 'ACARIENS'
  | 'POLLEN'
  | 'LAIT'
  | 'OEUFS'
  | 'CACAHUETTES'
  | 'SQUAMES_ANIMALES'
  | 'POISSON'
  | 'FRUITS_DE_MER'
  | 'POUSSIERE'
  | 'AUTRES';

export const GROUPES_SANGUINS: GroupSanguin[] = ['A_NEG', 'A_POS', 'B_NEG', 'B_POS', 'AB_NEG', 'AB_POS', 'O_NEG', 'O_POS'];
export const ALLERGIES: Allergie[] = ['ACARIENS', 'POLLEN', 'LAIT', 'OEUFS', 'CACAHUETTES', 'SQUAMES_ANIMALES', 'POISSON', 'FRUITS_DE_MER', 'POUSSIERE', 'AUTRES'];

export interface DossierMedical {
  idDossier?: number;
  user: User | null;
  maladies: string;
  objectifSante: string;
  traitements: string;
  tailles: number; // 👈 doit rester tailles comme en Java !
  poids: number;
  groupeSanguin: GroupSanguin;
  allergies: Allergie;
  archived?: boolean;
  imc?: number;
  rdvRecommande?: boolean;
}



