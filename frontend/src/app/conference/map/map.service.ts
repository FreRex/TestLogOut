import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { take } from 'rxjs/internal/operators/take';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

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
  constructor(private http: HttpClient) {}

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
}
