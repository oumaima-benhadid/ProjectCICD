import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Activite } from '../models/activite';

@Injectable({
  providedIn: 'root'
})
export class ActiviteServiceService {

 private baseUrl = 'http://localhost:8081/PIdev/activites';
  constructor(private http: HttpClient) {}

  getAll(): Observable<Activite[]> {
    return this.http.get<Activite[]>(this.baseUrl +"/readAllActivite");
  }

  getAllActivite(): Observable<any> {
    return this.http.get(this.baseUrl + "/readAllActivite", { responseType: 'text' });

  }


  getById(id: number): Observable<Activite> {
    return this.http.get<Activite>(`${this.baseUrl}/readActivite/${id}`);
  }

  create(activite: Activite): Observable<Activite> {
    return this.http.post<Activite>(`${this.baseUrl}/addActivite`, activite);
  }

  update(activite: Activite): Observable<Activite> {
    return this.http.put<Activite>(`${this.baseUrl}/updateActivite`, activite);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/deleteActivite/${id}`);
  }
  uploadImage(activiteId: number, formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/uploadImage/${activiteId}`, formData, {
      responseType: 'text' // ou 'json' selon ton backend
    });
  }
  getImage(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/image/${id}`, {
      responseType: 'blob'
    });
  }

  addActiviteWithImage(activite: Activite, image: File): Observable<Activite> {
    const formData = new FormData();
    formData.append('activite', new Blob([JSON.stringify(activite)], { type: 'application/json' }));
    formData.append('image', image);
    return this.http.post<Activite>(`${this.baseUrl}/addActiviteWithImage`, formData);
  }



}
