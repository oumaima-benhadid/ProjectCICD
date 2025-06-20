import { Component, OnInit } from '@angular/core';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import multiMonthPlugin from '@fullcalendar/multimonth';
import { RendezvousService } from 'src/app/services/gestionNutrition/rendezvous.service';
import { RendezVous, StatutRendezVous } from 'src/app/models/RendezVous.model';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  
  calendarOptions: CalendarOptions = {
    initialView: 'timeGridWeek',
    editable: true,
    droppable: true,
    selectable: true,
    eventResizableFromStart: true,
    eventDurationEditable: true,
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, multiMonthPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'timeGridDay,timeGridWeek,dayGridMonth,multiMonthYear'
    },
    views: {
      multiMonthYear: {
        type: 'multiMonth',
        duration: { months: 12 },
        buttonText: 'Year'
      },
    },
    events: [],
    eventDidMount: this.handleEventMount.bind(this)
  };

  private notificationTimeouts: {[key: number]: any} = {};

  constructor(
    private rendezvousService: RendezvousService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRendezVous();
  }

  navigateTodossier(): void {
    this.router.navigate(['/dossier-medical']).then(nav => {
      console.log('Navigation vers dossier médical réussie');
    }).catch(err => {
      console.error('Erreur de navigation:', err);
      this.toastr.error('Impossible d\'accéder au dossier médical', 'Erreur');
    });
  }

  loadRendezVous(): void {
    this.rendezvousService.retrieveAllRendezVous().subscribe({
      next: (rdvs) => {
        const events = rdvs.map(rdv => this.convertRdvToEvent(rdv));
        this.calendarOptions.events = events;
        this.setupReminders(rdvs);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des rendez-vous', err);
        this.toastr.error('Erreur lors du chargement des rendez-vous', 'Erreur');
      }
    });
  }

  private convertRdvToEvent(rdv: RendezVous): EventInput {
    const startDate = new Date(rdv.dateHeure);
    const endDate = new Date(startDate.getTime() + rdv.duree * 60000);
    
    return {
      id: rdv.idRendezVous.toString(),
      title: `RDV: ${rdv.remarque}`,
      start: startDate,
      end: endDate,
      backgroundColor: this.getEventColor(rdv.statut),
      extendedProps: {
        statut: rdv.statut,
        rappel: rdv.rappel
      }
    };
  }

  private getEventColor(statut: StatutRendezVous): string {
    switch(statut) {
      case StatutRendezVous.ACCEPTE: return '#99e699';
      case StatutRendezVous.EN_COURS: return '#99ccff';
      case StatutRendezVous.REFUSE: return '#ff9999';
      default: return '#ffcc99';
    }
  }

  private setupReminders(rdvs: RendezVous[]): void {
    Object.values(this.notificationTimeouts).forEach(timeout => clearTimeout(timeout));
    this.notificationTimeouts = {};

    const now = new Date();
    
    rdvs.forEach(rdv => {
      if (rdv.statut === StatutRendezVous.ACCEPTE && rdv.rappel) {
        const rdvDate = new Date(rdv.dateHeure);
        const reminderTime = new Date(rdvDate.getTime() - 10 * 60000);
        
        if (reminderTime > now) {
          const timeout = reminderTime.getTime() - now.getTime();
          
          this.notificationTimeouts[rdv.idRendezVous] = setTimeout(() => {
            this.showReminder(rdv);
          }, timeout);
        }
      }
    });
  }

  private showReminder(rdv: RendezVous): void {
    this.toastr.info(
      `Vous avez un rendez-vous dans 10 minutes: ${rdv.remarque}`,
      'Rappel de rendez-vous',
      {
        timeOut: 10000,
        positionClass: 'toast-top-right',
        progressBar: true
      }
    );
  }

  private handleEventMount(info: any): void {
    const event = info.event;
    const statut = event.extendedProps.statut;
    const rappel = event.extendedProps.rappel;

    if (statut === StatutRendezVous.ACCEPTE && rappel) {
      const reminderIcon = document.createElement('i');
      reminderIcon.className = 'bi bi-alarm ms-2';
      reminderIcon.title = 'Rappel activé (10 min avant)';
      
      const titleEl = info.el.querySelector('.fc-event-title');
      if (titleEl) {
        titleEl.appendChild(reminderIcon);
      }
    }
  } 
}