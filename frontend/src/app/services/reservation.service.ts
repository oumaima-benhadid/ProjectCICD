import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Reservation } from '../models/reservation';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  private apiUrl = 'http://localhost:8081/PIdev/reservations';

  constructor(private http: HttpClient) {}

  getAllReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/all`);
  }}
