import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { take } from 'rxjs/internal/operators/take';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { Socket } from 'ngx-socket-io';

export interface MapData {
  id: number;
  progettoselezionato: string;
  nome: string;
  nodifisici: string;
  nodiottici: string;
  tratte: string;
  edifopta: string;
  latcentromap: string;
  longcentrmap: string;
}

export interface Map {
  id: number;
  progettoselezionato: string;
  nome: string;
  nodifisici: string;
  nodiottici: string;
  tratte: string;
  edifopta: string;
  latcentromap: number;
  longcentrmap: number;
}

@Injectable({
  providedIn: 'root',
})
export class MapService {
  constructor(private http: HttpClient, private socket: Socket) {}

  // coord: { lat:string, long:string };

  coordinate = [];

  private coordinateSubject = new BehaviorSubject<
    { lat: string; long: string }[]
  >([]);
  coordinate$: Observable<{ lat: string; long: string }[]> =
    this.coordinateSubject.asObservable();

  /** SELECT mappa */
  fetchMap(roomId: number): Observable<Map> {
    return this.http
      .get<MapData>(`${environment.apiUrl}/mappaProgetto/${roomId}`)
      .pipe(
        map((mapData: MapData) => {
          let newMap: Map = {
            id: mapData[0].id,
            progettoselezionato: mapData[0].progettoselezionato,
            nome: mapData[0].nome,
            nodifisici: mapData[0].nodifisici,
            nodiottici: mapData[0].nodiottici,
            tratte: mapData[0].tratte,
            edifopta: mapData[0].edifopta,
            latcentromap: +mapData[0].latcentromap,
            longcentrmap: +mapData[0].longcentrmap,
          };
          // Elaborazioni shape
          if (mapData.edifopta != '') {
            newMap.nodifisici =
              mapData[0].nodifisici + ', ' + mapData[0].edifopta;
            newMap.nodiottici =
              mapData[0].nodiottici + ', ' + mapData[0].edifopta;
            newMap.tratte = mapData[0].tratte + ', ' + mapData[0].edifopta;
          } else {
            newMap.nodifisici = mapData[0].nodifisici;
            newMap.nodiottici = mapData[0].nodiottici;
            newMap.tratte = mapData[0].tratte;
          }

          return newMap;
        })
      );
  }

  idroom: number;
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
    this.socket.on('gpsUtente_idroom_' + this.idroom, function (msgGps: any) {
      console.log('msgGps.idroom: ', msgGps.idroom);
      console.log('msgGps.latitudine: ', msgGps.latitudine);
      console.log('msgGps.longitudine: ', msgGps.longitudine);
    });
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
}
