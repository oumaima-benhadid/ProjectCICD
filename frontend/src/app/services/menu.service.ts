import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import { Menu } from 'src/app/models/menu';  // Assure-toi que le chemin est correct
interface Comment {
  id: number;
  text: string;
  author: string;
  createdAt: string;
}
@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private apiUrl = 'http://localhost:8081/PIdev/menus';

  constructor(private http: HttpClient) {}


  getAllMenus(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }
  associatePlatsToMenu(menuId: number, platIds: number[]): Observable<any> {
    const requestBody = { platIds };
    return this.http.post(`${this.apiUrl}/${menuId}/associatePlats`, requestBody,{responseType:'text'});
  }

  getMenuById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }


  createMenu(menu: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, menu);
  }


  updateMenu(id: number, menu: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, menu);
  }


  deleteMenu(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  getConfirmedMenus(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/menus/confirmed`);
  }

  toggleLikeDislike(menuId: number, userId: number, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${menuId}/like/${userId}?status=${status}`, {}, { responseType: 'text' });
  }
  getCommentsByMenuId(menuId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/${menuId}/comments`);
  }

  addComment(menuId: number, userId: number, text: string): Observable<Comment> {
    return this.http.post<Comment>(
      `${this.apiUrl}/${menuId}/comment/${userId}`,
      { text }
    );
  }



  getUserLikeStatus(menuId: number, userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${menuId}/like-status?userId=${userId}`);
  }

  updateComment(comment: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${comment.menu.idMenu}/comment/${comment.id}`, comment);
  }

  // Delete a comment
  deleteComment(menuId: number, commentId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${menuId}/comment/${commentId}`);
  }

  searchMenus(query: string) {
    return this.http.get<any[]>(`${this.apiUrl}/search`, {
      params: { query}
    });

  }
// Dans menu.service.ts
getMenusForUser(userId: number): Observable<Menu[]> {
  return this.http.get<Menu[]>(`${this.apiUrl}/menus/user/${userId}`);
}

}
