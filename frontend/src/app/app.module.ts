// src/app/app.module.ts

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ClipboardModule } from 'ngx-clipboard';
import { ToastrModule } from 'ngx-toastr';
import { RecaptchaV3Module, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ListEventComponent } from './components/Evenementsback/list-event-back/list-event.component';
import { AddEventComponent } from './components/Evenementsback/add-event-back/add-event.component';
import { EvenementUserComponent } from './components/Evenementsfront/evenement-user/evenement-user.component';
import { TemplateComponent } from './template/template.component';
import { AbonnementsComponent } from './components/abonnements/abonnements.component';
import { NavbarfrontComponent } from './components/navbarfront/navbarfront.component';
import { FooterComponent } from './components/back/footer/footer.component';
import { NavbarComponent } from './components/back/navbar/navbar.component';
import { SidebarComponent } from './components/back/sidebar/sidebar.component';
import { AdminLayoutComponent } from './backoff/layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './backoff/layouts/auth-layout/auth-layout.component';

import { BacktempComponent } from './components/backtemp/backtemp.component';
import { AbonnementsbackComponent } from './components/abonnementsback/abonnementsback.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { VerifyCodeComponent } from './components/verify-code/verify-code.component';
import { AjoutReclamationComponent } from './components/ajout-reclamation/ajout-reclamation.component';
import { AdminReclamationsComponent } from './components/admin-reclamations/admin-reclamations.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { UserprofileeComponent } from './components/user-profilee/user-profilee.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { StatabonnementComponent } from './components/statabonnement/statabonnement.component';
import { AbonnementcardsComponent } from './components/abonnementcards/abonnementcards.component';
import { RenouvellementAbonnementComponent } from './components/renouvellement-abonnement/renouvellement-abonnement.component';
import { DossierListComponent } from './components/gestionNutrition/dossier-list/dossier-list.component';
import { DossierMedicalComponent } from './components/gestionNutrition/dossier-medical/dossier-medical.component';
import { AdminDossiersComponent } from './components/gestionNutrition/admin-dossiers/admin-dossiers.component';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { CoachChatComponent } from './components/coach-chat/coach-chat.component';
import { ActiviteBackComponent } from './components/activite-back/activite-back.component';
import { ActivitesComponent } from './components/activites/activites.component';
import { FilterPipe } from './pipes/filter.pipe';
import { SeancebackComponent } from './components/seanceback/seanceback.component';
import { SeanceoffComponent } from './components/seanceoff/seanceoff.component';
import { MesReservationsComponent } from './components/mes-reservations/mes-reservations.component';
import { DatePipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxPaginationModule } from 'ngx-pagination';
import { ReservationBackComponent } from './components/reservation-back/reservation-back.component';
import { ContactComponent } from './components/contact/contact.component';
import { DossierNComponent } from './components/gestionNutrition/dossier-n/dossier-n.component';
import { RendezvousComponent } from './components/gestionNutrition/rendezvous/rendezvous.component';
import { RendezvousNComponent } from './components/gestionNutrition/rendezvous-n/rendezvous-n.component';
import { AdminRdvComponent } from './components/gestionNutrition/admin-rdv/admin-rdv.component';
import { MenuComponent } from './components/menu/menu.component';
import { ListMenuComponent } from './components/list-menu/list-menu.component';
import { PlatComponent } from './components/plat/plat.component';
import { RecommendationsComponent } from './components/recommendations/recommendations.component';
import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web'

export function playerFactory() {
  return player;
}

@NgModule({
  declarations: [
    AppComponent,
    TemplateComponent,
    AbonnementsComponent,
    NavbarfrontComponent,
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
    BacktempComponent,
    AbonnementsbackComponent,
    LoginComponent,
    RegisterComponent,
    UserListComponent,
    VerifyCodeComponent,
    AjoutReclamationComponent,
    AdminReclamationsComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    UserprofileeComponent,
    ChangePasswordComponent,
    StatabonnementComponent,
    AbonnementcardsComponent,
    RenouvellementAbonnementComponent,
    CoachChatComponent,
    ActiviteBackComponent,
    ActivitesComponent,
    FilterPipe,
    SeancebackComponent,
    SeanceoffComponent,
    MesReservationsComponent ,
    ListEventComponent ,
    AddEventComponent,
    EvenementUserComponent,
    ReservationBackComponent,
    ContactComponent,
    DossierMedicalComponent,
    DossierNComponent,
    AdminDossiersComponent,
    RendezvousComponent,
    RendezvousNComponent,
    AdminRdvComponent,
    DossierListComponent,
    MenuComponent,
    PlatComponent, 
    RecommendationsComponent,
    ListMenuComponent
  

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    BrowserAnimationsModule,
    NgbModule,
    ClipboardModule,
    MatToolbarModule,
    MatToolbarModule,
    MatIconModule,
    MatDialogModule,
    NgxPaginationModule,
    RecaptchaV3Module,
    LottieModule.forRoot({ player: playerFactory }),

    CommonModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true
    })
  ],
  providers: [
    DatePipe ,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: RECAPTCHA_V3_SITE_KEY, useValue: '6LfWBBorAAAAALrnLVY567pNpMmE4DqFHRJLR4Jq' }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
