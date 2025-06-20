// src/app/user-profilee/user-profilee.component.ts

import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-userprofilee',
  templateUrl: './user-profilee.component.html',
})
export class UserprofileeComponent implements OnInit {
  user: any = {};
  selectedFile: File | null = null;
  photoPreview: string = '';
  successMsg: string = '';
  errorMsg: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const token = sessionStorage.getItem('jwt_token'); // Assurez-vous que le token est stocké avec cette clé
    if (!token) {
      this.errorMsg = '❌ Aucun token trouvé. Veuillez vous connecter.';
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get('http://localhost:8081/PIdev/user/me', { headers }).subscribe({
      next: (res: any) => {
        this.user = res;
        this.photoPreview = 'data:image/png;base64,' + res.photoProfil;
      },
      error: () => {
        this.errorMsg = '❌ Session expirée ou accès non autorisé.';
      }
    });
  }

  onPhotoSelected(event: any) {
    this.selectedFile = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.photoPreview = reader.result as string;
      this.user.photoProfil = this.photoPreview.split(',')[1];
    };
    if (this.selectedFile) {
      reader.readAsDataURL(this.selectedFile);
    }
  }

  saveChanges() {
    const token = sessionStorage.getItem('jwt_token');
    if (!token) {
      this.errorMsg = '❌ Aucun token trouvé. Veuillez vous reconnecter.';
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const payload = {
      nom: this.user.nom,
      prenom: this.user.prenom,
      numeroDeTelephone: this.user.numeroDeTelephone,
      photoProfil: this.user.photoProfil,
      sexe: this.user.sexe,
      dateNaissance: this.user.dateNaissance
    };

    this.http.put('http://localhost:8081/PIdev/user/update-profile', payload, {
      headers,
      responseType: 'text'
    }).subscribe({
      next: () => {
        this.successMsg = '✅ Profil mis à jour avec succès !';
        this.errorMsg = '';
      },
      error: () => {
        this.errorMsg = '❌ Une erreur est survenue lors de la mise à jour.';
        this.successMsg = '';
      }
    });
  }
}
