import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root',
})
export class GpsService {
  constructor(private socket: Socket) {}

  coordinate = [];

  private coordinateSubject = new BehaviorSubject<
    { lat: string; long: string }[]
  >([]);
  coordinate$: Observable<{ lat: string; long: string }[]> =
    this.coordinateSubject.asObservable();

  idroom: number;
  gpsInterval: any;

  ConfigIdRoom(idroom: number) {
    this.idroom = idroom;
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.showPosition.bind(this));
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  }

  async showPosition(position: {
    coords: { latitude: number; longitude: number };
  }) {
    //Parte per coordinate random
    function randomCoord(coordinataIni: any) {
      // console.log(coordinataIni);
      let coordinata = Number.parseFloat(coordinataIni).toFixed(4);
      //let coordinata = coordinataIni.toFixed(4);
      let coordRandom = (Math.random() * 180).toFixed(6);
      const baseDecimRandom = coordRandom.split('.');
      let base = baseDecimRandom[1];
      let lunghBase = base.length;
      const decimNew = base.substring(3, lunghBase);

      let finale = coordinata + decimNew;

      return finale;
    }

    let datalat: any = position.coords.latitude.toFixed(7);
    let datalong: any = position.coords.longitude.toFixed(7);
    let lat = randomCoord(datalat);
    let long = randomCoord(datalong);

    // GPS EMIT --------------------------------
    this.socket.emit('gps', {
      idroom: this.idroom,
      latitudine: lat,
      longitudine: long,
    });

    // GPS ON --------------------------------
    // this.socket.on('gpsUtente_idroom_' + this.idroom, function (msgGps: any) {
    //   console.log('msgGps.idroom: ', msgGps.idroom);
    //   console.log('msgGps.latitudine: ', msgGps.latitudine);
    //   console.log('msgGps.longitudine: ', msgGps.longitudine);
    // });
    //---------------------------------------------------

    this.coordinate.push({ lat: lat, long: long });

    this.coordinateSubject.next(this.coordinate);

    if (this.coordinate.length > 5) {
      this.coordinate.shift();
    }
  }

  // SOCKET - POSIZIONE MARKER --------------------------------
  socketMarker(lat: string, long: string) {
    // SOCKET EMIT - POSIZIONE MARKER --------------------------------
    this.socket.emit('posizioneMarker', {
      idroom: this.idroom,
      latitudine: lat,
      longitudine: long,
    });
    // SOCKET ON - POSIZIONE MARKER --------------------------------
    //this.socket.on('posMkrBckEnd_'+this.idroom, function(posMkrBckEnd: any){
    this.socket.on(`posMkrBckEnd_${this.idroom}`, function (posMkrBckEnd: any) {
      console.log('posMkrBckEnd.idroom11: ' + posMkrBckEnd.idroom);
      console.log('posMkrBckEnd.lat11: ' + posMkrBckEnd.latitudine);
      console.log('posMkrBckEnd.long11: ' + posMkrBckEnd.longitudine);
    });
  }

  startGps() {
    this.gpsInterval = setInterval(() => this.getLocation(), 2000);
    console.log('funzionaaaaa');
  }
  stopGps() {
    clearInterval(this.gpsInterval);
  }
}
