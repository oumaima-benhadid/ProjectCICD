import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

export interface DossierMedical {
  idDossier?: number;
  user: { idUser: number } | null;
  maladies: string;
  objectifSante: string;
  traitements: string;
  tailles: number;
  poids: number;
  groupeSanguin: string;
  allergies: string;
  archived: boolean;
  rdvRecommande: boolean;
  imc?: number;
}

@Injectable({
  providedIn: 'root'
})
export class DossierMedicalService {
  private apiUrl = 'http://localhost:8081/PIdev/api/dossierMedical'; 

  constructor(private http: HttpClient) {
    
  }

  getAllDossiers(): Observable<DossierMedical[]> {
    return this.http.get<DossierMedical[]>(`${this.apiUrl}/retrieveAllDossiers`);
  }

  addDossier(dossier: DossierMedical): Observable<DossierMedical> {
    return this.http.post<DossierMedical>(`${this.apiUrl}/addDossier`, dossier);
  }
  getMyDossier() {
    return this.http.get<DossierMedical>('http://localhost:8081/PIdev/api/dossierMedical/monDossier');
  }
  

  updateDossier(dossier: DossierMedical): Observable<DossierMedical> {
    return this.http.put<DossierMedical>(`${this.apiUrl}/updateDossier`, dossier);
  }

  // Remplacer la méthode archiveDossier existante par :
archiveDossier(id: number): Observable<DossierMedical> {
  return this.http.put<DossierMedical>(`${this.apiUrl}/archiveDossier/${id}`, {});
}

  // Pour le client (ne voir que les dossiers non archivés)
  getDossiersNonArchives(): Observable<DossierMedical[]> {
    return this.http.get<DossierMedical[]>('http://localhost:8081/api/dossiers/not-archived');
  }

  // Mise à jour du rdvRecommande avec paramètres dans l'URL
  updateRdvRecommande(id: number, rdvRecommande: boolean): Observable<DossierMedical> {
    const params = new HttpParams().set('rdvRecommande', rdvRecommande.toString());
    return this.http.put<DossierMedical>(`${this.apiUrl}/updateRdvRecommande/${id}`, null, { params });
  }

  // Ajoutez ces méthodes à votre service existant
getArchivedDossiers(): Observable<DossierMedical[]> {
  return this.http.get<DossierMedical[]>(`${this.apiUrl}/retrieveArchivedDossiers`);
}

restoreDossier(id: number): Observable<DossierMedical> {
  return this.http.put<DossierMedical>(`${this.apiUrl}/restoreDossier/${id}`, {});
}
}
