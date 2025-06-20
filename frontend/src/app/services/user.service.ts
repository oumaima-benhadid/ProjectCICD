import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserStatsResponse } from '../models/user-stats.model';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8081/PIdev/user';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/get/all`);
  }

  getUserById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/get/${id}`);
  }

  updateUser(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, data);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }

  archiveUser(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/archive/${id}`, {});
  }

  restoreUser(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/restore/${id}`, {});
  }

  filterByField(field: string, value: string): Observable<any> {
    const params = new HttpParams().set('field', field).set('value', value);
    return this.http.get(`${this.apiUrl}/filter`, { params });
  }

  getSortedUsers(page: number = 0, size: number = 10): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/sorted?page=${page}&size=${size}`);
  }


  getUserStats(): Observable<UserStatsResponse> {
    return this.http.get<UserStatsResponse>(`${this.apiUrl}/users/stats`);
  }

  banUser(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/ban/${id}`, {});
  }

  unbanUser(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/unban/${id}`, {});
  }


  checkEmail(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/check-email`, { params: { email } });
  }
}
