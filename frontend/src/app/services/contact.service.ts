import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  private apiUrl = 'http://localhost:8081/PIdev/api/contact'; // Ton endpoint Spring Boot

  constructor(private http: HttpClient) { }

  sendContactForm(formData: any): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }
}
