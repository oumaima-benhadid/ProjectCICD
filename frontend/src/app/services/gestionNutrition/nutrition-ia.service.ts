import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NutritionIAService {
  private baseUrl = 'http://localhost:8081/PIdev/api/nutrition';

  constructor(private http: HttpClient) {}

  getPrediction(dossierId: number, activity: string, duration: number, city: string): Observable<any> {
    const params = new HttpParams()
      .set('activite', activity)
      .set('duree', duration.toString())
      .set('city', city);

    return this.http.post(`${this.baseUrl}/${dossierId}/predict`, null, { params });
  }
}
