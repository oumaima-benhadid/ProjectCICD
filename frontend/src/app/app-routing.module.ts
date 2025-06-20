// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TemplateComponent } from './template/template.component';
import { AbonnementsComponent } from './components/abonnements/abonnements.component';
import { AbonnementcardsComponent } from './components/abonnementcards/abonnementcards.component';
import { RenouvellementAbonnementComponent } from './components/renouvellement-abonnement/renouvellement-abonnement.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { VerifyCodeComponent } from './components/verify-code/verify-code.component';
import { UserprofileeComponent } from './components/user-profilee/user-profilee.component';
import { AjoutReclamationComponent } from './components/ajout-reclamation/ajout-reclamation.component';

import { BacktempComponent } from './components/backtemp/backtemp.component';
import { DashboardComponent } from './backoff/pages/dashboard/dashboard.component';
import { IconsComponent } from './backoff/pages/icons/icons.component';
import { MapsComponent } from './backoff/pages/maps/maps.component';
import { UserProfileComponent } from './backoff/pages/user-profile/user-profile.component';
import { TablesComponent } from './backoff/pages/tables/tables.component';
import { LoginComponent as AdminLoginComponent } from './backoff/pages/login/login.component';
import { RegisterComponent as AdminRegisterComponent } from './backoff/pages/register/register.component';
import { AbonnementsbackComponent } from './components/abonnementsback/abonnementsback.component';
import { AdminReclamationsComponent } from './components/admin-reclamations/admin-reclamations.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { StatabonnementComponent } from './components/statabonnement/statabonnement.component';

import { AdminLayoutComponent } from './backoff/layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './backoff/layouts/auth-layout/auth-layout.component';
import { CoachChatComponent } from './components/coach-chat/coach-chat.component';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { ActiviteBackComponent } from './components/activite-back/activite-back.component';
import { SeancebackComponent } from './components/seanceback/seanceback.component';
import { ActivitesComponent } from './components/activites/activites.component';
import { SeanceoffComponent } from './components/seanceoff/seanceoff.component';
import { MesReservationsComponent } from './components/mes-reservations/mes-reservations.component';
import { AboutComponent } from './components/about/about.component';
import { ListEventComponent } from './components/Evenementsback/list-event-back/list-event.component';
import { EvenementUserComponent } from './components/Evenementsfront/evenement-user/evenement-user.component';
import { ReservationBackComponent } from './components/reservation-back/reservation-back.component';
import { ContactComponent } from './components/contact/contact.component';
import { DossierMedicalComponent } from './components/gestionNutrition/dossier-medical/dossier-medical.component';
import { DossierNComponent } from './components/gestionNutrition/dossier-n/dossier-n.component';
import { AdminDossiersComponent } from './components/gestionNutrition/admin-dossiers/admin-dossiers.component';
import { RendezvousComponent } from './components/gestionNutrition/rendezvous/rendezvous.component';
import { RendezvousNComponent } from './components/gestionNutrition/rendezvous-n/rendezvous-n.component';
import { AdminRdvComponent } from './components/gestionNutrition/admin-rdv/admin-rdv.component';
import { MenuComponent } from './components/menu/menu.component';
import { ListMenuComponent } from './components/list-menu/list-menu.component';
import { PlatComponent } from './components/plat/plat.component';
import { RecommendationsComponent } from './components/recommendations/recommendations.component';

const routes: Routes = [
  {
    path: '',
    component: TemplateComponent,
    children: [
      // public
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'reset-password', component: ResetPasswordComponent },
      { path: 'change-password', component: ChangePasswordComponent },
      { path: 'verify-code', component: VerifyCodeComponent },
      { path: 'userprofilee', component: UserprofileeComponent },
      { path: 'listmenu', component: ListMenuComponent , canActivate: [authGuard] } ,


      // private (auth required)
      { path: 'abonnements', component: AbonnementsComponent, canActivate: [authGuard] },
      { path: 'abonnements-cards', component: AbonnementcardsComponent, canActivate: [authGuard] },
      { path: 'renouvellement', component: RenouvellementAbonnementComponent, canActivate: [authGuard] },
      { path: 'reclamation', component: AjoutReclamationComponent, canActivate: [authGuard] },
      { path: 'evenements', component: EvenementUserComponent ,canActivate: [authGuard] } ,

      { path: 'seance', component: SeanceoffComponent, canActivate: [authGuard] },
      { path: 'seances/:activiteId', component: SeanceoffComponent, canActivate: [authGuard]  }, // Route pour afficher les séances
      {path:'mesReservations',component:MesReservationsComponent},
      { path: 'rendez-vous', component: RendezvousComponent ,canActivate: [authGuard] },
      { path:'about',component:AboutComponent},
      { path: 'coach', component: CoachChatComponent },
      {path : 'contact',component: ContactComponent},
      { path: 'dossier-medical', component: DossierMedicalComponent },

    ]

    
  },
  {
    path: 'etudiant',
    component: TemplateComponent,
    data: { expectedRole: 'Etudiant' },
    children: [
      { path: 'activite', component: ActivitesComponent , canActivate: [authGuard]},

    ]
  },
  
  {
    path: 'nutritionniste',
    component: TemplateComponent,
    data: { expectedRole: 'Nutritionniste' },
    children: [
      { path: 'dossier-nutritionniste', component: DossierNComponent },
      {path : 'RendezVousNutritionniste' , component: RendezvousNComponent},


    ]
  },
  {
    path: 'admin',
    component: BacktempComponent,
    canActivate: [authGuard, roleGuard],
    data: { expectedRole: 'Admin' },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'icons', component: IconsComponent },
      { path: 'maps', component: MapsComponent },
      { path: 'user-profile', component: UserProfileComponent },
      { path: 'tables', component: TablesComponent },
      { path: 'login', component: AdminLoginComponent },
      { path: 'register', component: AdminRegisterComponent },
      { path: 'abonnementsback', component: AbonnementsbackComponent },
      { path: 'users', component: UserListComponent },
      { path: 'reclamations', component: AdminReclamationsComponent },
      { path: 'list-event', component: ListEventComponent },
      { path: 'statabonnement', component: StatabonnementComponent },
      {path : 'dossiers', component: AdminDossiersComponent},
      {path : 'rendezvous', component: AdminRdvComponent},
      { path: 'plat', component: PlatComponent },
      { path: 'menu', component: MenuComponent }

    ]
  },
  {
    path: 'admin-coach',
    component: BacktempComponent,
    canActivate: [authGuard, roleGuard],
    data: { expectedRole: 'Coach' },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'activite-back', component: ActiviteBackComponent },
      { path: 'seanceback/:id', component: SeancebackComponent },
      { path: 'reservation', component: ReservationBackComponent },

    ]
  },
  
  {
    path: 'admin-old',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./backoff/layouts/admin-layout/admin-layout.module').then(m => m.AdminLayoutModule)
      }
    ]
  },

  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./backoff/layouts/auth-layout/auth-layout.module').then(m => m.AuthLayoutModule)
      }
    ]
  },

  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
