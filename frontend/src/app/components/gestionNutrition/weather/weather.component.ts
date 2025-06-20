import { Component } from '@angular/core';
import { WeatherService } from 'src/app/services/gestionNutrition/weather.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent {
  city = '';
  weatherData: any;
  isLoading = false;
  errorMessage = '';

  constructor(private weatherService: WeatherService) {}

  fetchWeather() {
    if (!this.city.trim()) {
      this.errorMessage = 'Veuillez entrer une ville';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.weatherData = null;

    this.weatherService.getFullWeather(this.city).subscribe({
      next: (data) => {
        this.weatherData = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors de la récupération des données météo';
        this.isLoading = false;
        console.error(err);
      }
    });
  }
}