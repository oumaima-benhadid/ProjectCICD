import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const BASE_URL = 'http://localhost:8081/PIdev/Abonnement';
const USER_URL = 'http://localhost:8081/PIdev/user';


@Injectable({
  providedIn: 'root'
})
export class AbonnementService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${BASE_URL}/retrieveAllAbonnements`);
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${BASE_URL}/retrieveAbonnement/${id}`);
  }

  add(abonnement: any): Observable<any> {
    return this.http.post<any>(`${BASE_URL}/addAbonnement`, abonnement);
  }

  archive(id: number): Observable<any> {
    return this.http.put(`${BASE_URL}/archiveAbonnement/${id}`, {});
  }

  restore(id: number): Observable<any> {
    return this.http.put(`${BASE_URL}/restoreAbonnement/${id}`, {});
  }

  getPaged(page = 0, size = 10, sortBy = 'dateCreation', direction = 'asc'): Observable<any> {
    if (page < 0) page = 0;
    return this.http.get<any>(`${BASE_URL}/retrieveAllAbonnementsPaged?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`);
  }
  
  search(keyword: string, page = 0, size = 10, sortBy = 'dateCreation', direction = 'asc'): Observable<any> {
    return this.http.get<any>(`${BASE_URL}/search?keyword=${keyword}&page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`);
  }
  getArchived(): Observable<any[]> {
    return this.http.get<any[]>(`${BASE_URL}/retrieveArchivedAbonnements`);
  }
  searchArchived(keyword: string, page = 0, size = 10, sortBy = 'dateCreation', direction = 'asc'): Observable<any> {
    return this.http.get<any>(
      `${BASE_URL}/searchArchived?keyword=${keyword}&page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`
    );
  }
  getArchivedPaged(page = 0, size = 10, sortBy = 'dateCreation', direction = 'asc'): Observable<any> {
    return this.http.get<any>(`${BASE_URL}/retrieveArchivedAbonnementsPaged?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`);
  }
  /*renouvelerAbonnementParUser(idUser: number, duree: string, type: string, stripeToken: string) {
    return this.http.put<any>(
      `${BASE_URL}/renouvelerByUser/${idUser}?duree=${duree}&type=${type}&stripeToken=${stripeToken}`, {}
    );
  }*/
 
  
    renouvelerAbonnementParUser(duree: string, type: string, stripeToken: string) {
      return this.http.put<any>(
        `${BASE_URL}/renouveler?duree=${duree}&type=${type}&stripeToken=${stripeToken}`,
        null
      );
    }
    
    
    getPointsFidelite(idUser: number) {
      return this.http.get<number>(`${USER_URL}/points-fidelite/${idUser}`);
    }
    getProfilIA(idUser: number): Observable<any> {
      return this.http.get<any>(`http://localhost:8081/PIdev/analytics/predict-user-profil/${idUser}`);
    }
    predictRenewal(idUser: number): Observable<any> {
      return this.http.get<any>(`http://localhost:8081/PIdev/analyticsAi/predict-renewal/${idUser}`);
    }
    
}
