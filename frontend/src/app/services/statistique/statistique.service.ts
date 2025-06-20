import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const BASE_URL = 'http://localhost:8081/PIdev/stats';

@Injectable({
  providedIn: 'root'
})
export class StatistiqueService {

  constructor(private http: HttpClient) {}

  getAbonnementsParType(): Observable<Map<string, number>> {
    return this.http.get<Map<string, number>>(`${BASE_URL}/abonnement-types`);
  }

  getRevenusMensuels(): Observable<any[]> {
    return this.http.get<any[]>(`${BASE_URL}/monthly-revenue`);
  }

  getNewUsersPerMonth(): Observable<any[]> {
    return this.http.get<any[]>(`${BASE_URL}/new-users-per-month`);
  }
}
