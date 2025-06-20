import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: any[] = [];
  page: number = 0;
  size: number = 5;
  totalPages: number = 0;

  filterField: string = '';
  filterValue: string = '';
  fieldOptions: string[] = ['nom', 'prenom', 'sexe'];
  valueOptions: string[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadSortedUsers();
  }

  loadSortedUsers() {
    this.userService.getSortedUsers(this.page, this.size).subscribe({
      next: (res) => {
        this.users = res.content;
        this.totalPages = res.totalPages;
      },
      error: (err) => console.error('Erreur pagination:', err)
    });
  }

  nextPage() {
    if (this.page < this.totalPages - 1) {
      this.page++;
      this.loadSortedUsers();
    }
  }

  prevPage() {
    if (this.page > 0) {
      this.page--;
      this.loadSortedUsers();
    }
  }

  applyFilter() {
    if (this.filterField && this.filterValue) {
      this.userService.filterByField(this.filterField, this.filterValue).subscribe({
        next: (res) => {
          this.users = res;
          this.totalPages = 1;
        },
        error: (err) => console.error('Erreur filtre:', err)
      });
    } else {
      this.loadSortedUsers();
    }
  }

  clearFilter() {
    this.filterField = '';
    this.filterValue = '';
    this.valueOptions = [];
    this.loadSortedUsers();
  }

  banUser(id: number) {
    this.userService.banUser(id).subscribe({
      next: () => {
        // ✅ Mise à jour directe de l'utilisateur sans reload
        const user = this.users.find(u => u.idUser === id);
        if (user) user.banned = true;
      },
      error: (err) => {
        if (err.status === 403) {
          console.warn('🚫 Déjà banni');
        } else {
          console.error("Erreur lors du bannissement :", err);
        }
      }
    });
  }
  
  unbanUser(id: number) {
    this.userService.unbanUser(id).subscribe({
      next: () => {
        const user = this.users.find(u => u.idUser === id);
        if (user) user.banned = false;
      },
      error: (err) => {
        console.error("Erreur débannissement :", err);
      }
    });
  }
  

  onFieldChange() {
    if (this.filterField === 'sexe') {
      this.valueOptions = ['Homme', 'Femme'];
    } else if (this.filterField === 'banned') {
      this.valueOptions = ['true', 'false'];
    } else {
      this.valueOptions = [];
    }
    this.filterValue = '';
  }
}
