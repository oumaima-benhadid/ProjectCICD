// src/app/services/toxicity.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToxicityService {
  private apiUrl = 'http://localhost:5000/analyze'; 

  constructor(private http: HttpClient) {}

  analyzeText(text: string) {
    return this.http.post<any>(this.apiUrl, { text });
  }
}
