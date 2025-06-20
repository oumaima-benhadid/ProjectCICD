import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Reclamation, ReclamationRequest } from '../models/reclamation.model';

@Injectable({ providedIn: 'root' })
export class ReclamationService {
  private apiUrl = 'http://localhost:8081/PIdev/reclamations';

  constructor(private http: HttpClient) {}

  addReclamation(data: ReclamationRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/save`, data);
  }

  getAll(): Observable<Reclamation[]> {
    return this.http.get<Reclamation[]>(`${this.apiUrl}/getall`);
  }

  updateReclamation(id: number, data: Partial<ReclamationRequest>): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, data);
  }

  getReclamationById(id: number): Observable<Reclamation> {
    return this.http.get<Reclamation>(`${this.apiUrl}/get/${id}`);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }

  archive(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/archive/${id}`, {}, { responseType: 'text' as 'json' });
  }

  restore(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/restore/${id}`, {}, { responseType: 'text' as 'json' });
  }


  getMyReclamations(): Observable<Reclamation[]> {
    return this.http.get<Reclamation[]>(`${this.apiUrl}/mes-reclamations`);
  }
  getMesSeances(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/mes-seances`);
  }
  getMesEvenements(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/mes-evenements`);
  }
}
