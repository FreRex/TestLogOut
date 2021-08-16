import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import Geolocation from 'ol/Geolocation';

export interface GpsCoordinates {
  latitude: string;
  longitude: string;
}
@Injectable({
  providedIn: 'root',
})
export class GpsService /* implements OnInit */ {
  constructor(private socket: Socket) {}

  coordinate = [];

  // ngOnInit(){
  //   const geolocation = new Geolocation({
  //     // enableHighAccuracy must be set to true to have the heading value.
  //     trackingOptions: {
  //       enableHighAccuracy: true,
  //     },
  //     projection: view.getProjection(),
  //   });

  //   // update the HTML page when the position changes.
  // geolocation.on('change', function () {
  //   el('accuracy').innerText = geolocation.getAccuracy() + ' [m]';
  //   el('altitude').innerText = geolocation.getAltitude() + ' [m]';
  //   el('altitudeAccuracy').innerText = geolocation.getAltitudeAccuracy() + ' [m]';
  //   el('heading').innerText = geolocation.getHeading() + ' [rad]';
  //   el('speed').innerText = geolocation.getSpeed() + ' [m/s]';
  // });

  // // handle geolocation error.
  // geolocation.on('error', function (error) {
  //   const info = document.getElementById('info');
  //   info.innerHTML = error.message;
  //   info.style.display = '';
  // });
  // }

  coordinateSubject = new BehaviorSubject<GpsCoordinates>(null);
  coordinate$ = this.coordinateSubject.asObservable();

  idroom: number;
  gpsInterval: any;

  ConfigIdRoom(idroom: number) {
    this.idroom = idroom;
  }

  // getLocation() {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(this.showPosition.bind(this));
  //   } else {
  //     console.log('Geolocation is not supported by this browser.');
  //   }
  // }

  // async showPosition(position: {
  //   coords: { latitude: number; longitude: number };
  // }) {
  //   let lat = position.coords.latitude;
  //   let long = position.coords.longitude;

  //   GPS EMIT --------------------------------
  //   this.socket.emit('gps', {
  //     idroom: this.idroom,
  //     latitudine: lat,
  //     longitudine: long,
  //   });

  //   this.coordinate.push({ lat: lat, long: long });

  //    this.coordinateSubject.next(this.coordinate);

  //   if (this.coordinate.length > 5) {
  //     this.coordinate.shift();
  //   }
  // }

  // SOCKET - POSIZIONE MARKER --------------------------------
  socketEmitMarkerBlu(lat: string, long: string) {
    // SOCKET EMIT - POSIZIONE MARKER --------------------------------
    this.socket.emit('posizioneMarker', {
      idroom: this.idroom,
      latitudine: lat,
      longitudine: long,
    });
  }

  // startGps() {
  //   this.gpsInterval = setInterval(() => this.getLocation(), 2000);
  // }
  stopGps() {
    clearInterval(this.gpsInterval);
  }
}
