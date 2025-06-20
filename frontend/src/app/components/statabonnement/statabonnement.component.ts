import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {
  Chart,
  registerables
} from 'chart.js';
import { StatistiqueService } from 'src/app/services/statistique/statistique.service';

Chart.register(...registerables); // 📌 Obligatoire avec Chart.js v3/v4

@Component({
  selector: 'app-statabonnement',
  templateUrl: './statabonnement.component.html',
  styleUrls: ['./statabonnement.component.css']
})
export class StatabonnementComponent implements OnInit {

  @ViewChild('abonnementChart') abonnementChartRef!: ElementRef;
  @ViewChild('revenueChart') revenueChartRef!: ElementRef;

  constructor(private statService: StatistiqueService) {}

  ngOnInit() {
    setTimeout(() => {
      this.loadAbonnementTypeStats();
      this.loadRevenueStats();
    }, 0); // s'assurer que les canvas existent
  }

  loadAbonnementTypeStats() {
    this.statService.getAbonnementsParType().subscribe((data) => {
      new Chart(this.abonnementChartRef.nativeElement, {
        type: 'pie',
        data: {
          labels: Object.keys(data),
          datasets: [{
            label: 'Abonnements par type',
            data: Object.values(data),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'] // 🖌️ Couleurs
          }]
        }
      });
    });
  }

  loadRevenueStats() {
    this.statService.getRevenusMensuels().subscribe((data) => {
      new Chart(this.revenueChartRef.nativeElement, {
        type: 'line',
        data: {
          labels: Object.keys(data),
          datasets: [{
            label: 'Revenus mensuels',
            data: Object.values(data),
            fill: false,
            borderColor: 'blue'
          }]
        }
      });
    });
  }
}