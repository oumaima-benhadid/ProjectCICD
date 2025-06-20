import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private apiUrl = 'http://localhost:8081/PIdev/auth/registration';

  constructor(private http: HttpClient) {}

  registerUser(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }
}
