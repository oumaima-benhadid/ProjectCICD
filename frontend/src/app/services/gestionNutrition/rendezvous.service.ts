import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RendezVous } from 'src/app/models/RendezVous.model';

@Injectable({
  providedIn: 'root'
})
export class RendezvousService {
  private baseUrl = 'http://localhost:8081/PIdev/rendezvous';
  
  constructor(private http: HttpClient) { }

  retrieveAllRendezVous(): Observable<RendezVous[]> {
    return this.http.get<RendezVous[]>(`${this.baseUrl}/retrieveAllRendezVous`);
  }

  retrieveRendezVous(id: number): Observable<RendezVous> {
    return this.http.get<RendezVous>(`${this.baseUrl}/retrieveRendezVous/${id}`);
  }

  addRendezVous(rendezVous: RendezVous): Observable<RendezVous> {
    return this.http.post<RendezVous>(`${this.baseUrl}/addRendezVous`, rendezVous, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  updateRendezVous(id: number, rdv: RendezVous): Observable<RendezVous> {
    return this.http.put<RendezVous>(`${this.baseUrl}/updateRendezVous/${id}`, rdv, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  updateStatutRendezvous(id: number, statut: string): Observable<RendezVous> {
    return this.http.patch<RendezVous>(
      `${this.baseUrl}/updateStatutRendezVous/${id}`,
      { statut },
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        })
      }
    );
  }

  archiveRendezVous(id: number): Observable<RendezVous> {
    return this.http.put<RendezVous>(`${this.baseUrl}/archiveRendezVous/${id}`, null, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
    });
  }
  // Ajoutez ces méthodes à votre service existant
getArchivedRendezVous(): Observable<RendezVous[]> {
  return this.http.get<RendezVous[]>(`${this.baseUrl}/retrieveArchivedRendezVous`);
}

restoreRendezVous(id: number): Observable<RendezVous> {
  return this.http.put<RendezVous>(`${this.baseUrl}/restoreRendezVous/${id}`, {});
}
getMesRendezVous(): Observable<RendezVous[]> {
  return this.http.get<RendezVous[]>(`${this.baseUrl}/mesRendezVous`);
}

}