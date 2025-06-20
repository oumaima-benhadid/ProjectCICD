import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
  roles: string[];
}

const ROUTES: RouteInfo[] = [
  { path: 'users', title: 'Users', icon: 'ni ni-circle-08 text-pink', class: '', roles: ['Admin'] },
  { path: '/admin/reclamations', title: 'Reclamations', icon: 'ni ni-circle-08 text-pink', class: '', roles: ['Admin'] },
  { path: '/admin/abonnementsback', title: 'Abonnements', icon: 'ni ni-collection', class: '', roles: ['Admin'] },
 { path: '/admin/list-event', title: 'Evenements', icon: 'ni ni-collection', class: '', roles: ['Admin'] },
  { path: '/admin-coach/activite-back', title: 'Activites', icon: 'ni ni-circle-08 text-pink', class: '', roles: ['Coach'] },
  { path: '/admin-coach/reservation', title: 'Reservation', icon: 'ni ni-circle-08 text-pink', class: '', roles: ['Coach'] },
  { path: '/admin/dossiers', title: 'Dossiers', icon: 'ni ni-circle-08 text-pink', class: '', roles: ['Admin'] }
,
{ path: '/admin/menu', title: 'menu', icon: 'ni ni-collection', class: '', roles: ['Admin'] },

{ path: '/admin/plat', title: 'plat', icon: 'ni ni-collection', class: '', roles: ['Admin'] },



];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public menuItems: any[] = [];
  public isCollapsed = true;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    const role = this.authService.getRole();

    if (role) {
      this.menuItems = ROUTES.filter(menuItem => menuItem.roles.includes(role));
    } else {
      this.menuItems = [];
    }
        this.router.events.subscribe(() => {
      this.isCollapsed = true;
    });
  }
  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
