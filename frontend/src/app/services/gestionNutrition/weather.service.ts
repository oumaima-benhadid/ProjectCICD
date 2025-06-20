import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface WeatherFullResponse {
  city: string;
  temperature: number;
  humidity: number;
  waterAdjustment: number;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiUrl = 'http://localhost:8081/PIdev/api/weather'; // Notez le /PIdev

  constructor(private http: HttpClient) { }

  getFullWeather(city: string): Observable<WeatherFullResponse> {
    return this.http.get<WeatherFullResponse>(`${this.apiUrl}/full?city=${encodeURIComponent(city)}`);
  }

  getSimpleAdjustment(city: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/adjustment?city=${encodeURIComponent(city)}`);
  }
}