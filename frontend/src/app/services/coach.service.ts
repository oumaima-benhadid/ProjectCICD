import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CoachService {
  private apiUrl = 'http://localhost:8081/PIdev/chat';

  constructor(private http: HttpClient) {}

  askQuestion(message: string): Observable<string> {
    return this.http.post(`${this.apiUrl}/ask`, { message }, { responseType: 'text' });
  }

  getHistory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/history`);
  }
  getEmotions() {
    return this.http.get<{stress: number, sadness: number, motivation: number}>('http://localhost:8081/PIdev/chat/emotions');
  }
  deleteHistory(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/history`);
  }
  downloadPdfHistory(): Promise<void> {
    return fetch('http://localhost:8081/PIdev/chat/history/pdf', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`
      }
    })
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'historique_coach.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      });
  }
}
