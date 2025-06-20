import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IaServiceService {

  constructor(private http: HttpClient) {}

  getPlanning(userId: number) {
    return this.http.get<any[]>(`http://localhost:5003/api/ia-planning/${userId}`);
  }
}
