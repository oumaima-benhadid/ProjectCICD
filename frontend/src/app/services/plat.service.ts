import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class PlatService {

  private apiUrl = 'http://localhost:8081/PIdev/plat'; // Replace with your backend API URL

  constructor(private http: HttpClient) {}


  addPlat(platRequest: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, platRequest);
  }


  updatePlat(idPlat: number, plat: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${idPlat}`, plat);
  }


  deletePlat(idPlat: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${idPlat}`);
  }


  getAllPlats(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`);
  }
}
