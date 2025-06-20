import { Component, OnInit } from '@angular/core';
declare const google: any;

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss']
})
export class MapsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    const mapElement = document.getElementById('map');
    if (mapElement) {
      const latStr = mapElement.getAttribute('data-lat');
      const lngStr = mapElement.getAttribute('data-lng');

      const lat = latStr ? parseFloat(latStr) : 36.8065;  // Default Tunis
      const lng = lngStr ? parseFloat(lngStr) : 10.1815;

      const myLatlng = new google.maps.LatLng(lat, lng);

      const mapOptions = {
        zoom: 12,
        scrollwheel: false,
        center: myLatlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: [
          { "featureType": "administrative", "elementType": "labels.text.fill", "stylers": [{ "color": "#444444" }] },
          { "featureType": "landscape", "elementType": "all", "stylers": [{ "color": "#f2f2f2" }] },
          { "featureType": "poi", "elementType": "all", "stylers": [{ "visibility": "off" }] },
          { "featureType": "road", "elementType": "all", "stylers": [{ "saturation": -100 }, { "lightness": 45 }] },
          { "featureType": "road.highway", "elementType": "all", "stylers": [{ "visibility": "simplified" }] },
          { "featureType": "road.arterial", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] },
          { "featureType": "transit", "elementType": "all", "stylers": [{ "visibility": "off" }] },
          { "featureType": "water", "elementType": "all", "stylers": [{ "color": '#9b1d1d' }, { "visibility": "on" }] }
        ]
      };

      const map = new google.maps.Map(mapElement, mapOptions);

      const marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        animation: google.maps.Animation.DROP,
        title: 'Hello World!'
      });

      const contentString = `
        <div class="info-window-content">
          <h2>Argon Dashboard</h2>
          <p>A beautiful Dashboard for Bootstrap 4. It is Free and Open Source.</p>
        </div>`;

      const infowindow = new google.maps.InfoWindow({
        content: contentString
      });

      google.maps.event.addListener(marker, 'click', function () {
        infowindow.open(map, marker);
      });
    }
  }
}
