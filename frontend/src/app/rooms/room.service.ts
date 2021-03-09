import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, take, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

/** Interfaccia che definisce la Room all'interno del progetto */
export interface Room {
  id: number;
  usermobile: string;
  nome_progetto: string;
  nome_collaudatore: string;
  data_inserimento: Date;
  // public pk_project?: number,
  // public commessa?: string,
}

/** Interfaccia che definisce la Room come mi arriva sul JSON */
export interface ResponseRoom {
  id: number;
  usermobile: string;
  progettoselezionato: string;
  collaudatoreufficio: string;
  DataInsert: Date;
}

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  /** Lista delle room sotto forma di BehaviourSubject */
  private _rooms = new BehaviorSubject<Room[]>([  // <-- "_rooms" può emettere eventi perchè è un BehaviourSubject
    {
      id: 1,
      usermobile: '1',
      nome_progetto: 'Progetto 1',
      nome_collaudatore: 'Collaudatore 1',
      data_inserimento: new Date(2021, 3, 1),
    },
    {
      id: 2,
      usermobile: '2',
      nome_progetto: 'Progetto 2',
      nome_collaudatore: 'Collaudatore 2',
      data_inserimento: new Date(2021, 3, 2),
    },
    {
      id: 3,
      usermobile: '3',
      nome_progetto: 'Progetto 3',
      nome_collaudatore: 'Collaudatore 3',
      data_inserimento: new Date(2021, 3, 3),
    },
  ]);

  /** Ritorna la lista di tutti i progetti come Osservabile */
  get rooms(): Observable<Room[]> {
    return this._rooms.asObservable();            // <-- "rooms" NON può emettere eventi, ma può essere sottoscritto, perchè è un Observable
  }

  /** Ritorna una singola room sotto forma di Osservabile */
  getRoom(id: number): Observable<Room> {
    return this.rooms.pipe(take(1),
      map((rooms: Room[]) => {                              // <-- applico una funzione di filtro all'array di room che ho preso con take(1)
        return { ...rooms.find(room => room.id === id) };   // <-- ritorna vero quando trova il progeto giusto
      }));
  }

  constructor(private http: HttpClient, private authService: AuthService) { }

  // getRooms() {
  //   return this._rooms.slice();  // <-- slice() = crea una copia dell'array
  //   // return [...this.rooms];        // <-- Spread Operator = ritorna i singoli valori dell'array = crea una copia dell'array
  // }

  // getRoomsFiltered(collaudatore: string) {
  //   return {
  //     ...this._rooms.filter(room => {
  //       return room.nome_collaudatore === collaudatore;
  //     })
  //   };
  // }

  // getRoomById(id: string): Room {
  //   return {
  //     ...this._rooms.find(room => {   // <-- ritorna una copia del progetto con lo spread operator
  //       return room.usermobile === id;  // <-- ritorna vero quando trova il progeto giusto
  //     })
  //   };
  // }

  /** Aggiunge una nuova room alla lista */
  addRoom(id: number, usermobile: string, nome_progetto: string, nome_collaudatore: string) {
    const newRoom =
    {
      id: id,
      usermobile: usermobile,
      nome_progetto: nome_progetto,
      nome_collaudatore: nome_collaudatore,
      data_inserimento: new Date()
    };

    this.rooms
      .pipe(take(1))                // <-- take(1) = dopo la prima emissione dell'Osservabile togli la sottoscrizione
      .subscribe(                   // <-- mi sottoscrivo all'osservabile
        (rooms: Room[]) => {        // <-- applico una funzione all'array emesso dall'osservabile (solo 1 perchè uso take(1))
          this._rooms.next(         // <-- next() = emetto il nuovo array concatencato come prossimo elemento del BehaviourSubject 
            rooms.concat(newRoom)   // <-- prendo il vecchio array emesso dall'osservabile e concateno il nuovo elemento
          );
        }
      );
  }

  /** Cancella una room */
  deleteRoom(id: string) {
    // this._rooms = this._rooms.filter(room => {  // <-- filter() = filtra un array in base a una regola ("se è vero")
    //   return room.usermobile !== id;                // <-- ritrorna vero per tutte le ricette tranne quella che voglio scartare
    // });
    // this.roomsChanged.next(this._rooms.slice());
  }

  /** Salva una room dopo una modifica */
  saveRoom(id: number, usermobile: string, nome_progetto: string, nome_collaudatore: string) {
    // const index = this._rooms.findIndex(room => {
    //   return room.usermobile === usermobile;
    // });
    // this._rooms[index] = new Room(id, usermobile, nome_progetto, nome_collaudatore, new Date());
    // this.roomsChanged.next(this._rooms.slice());
  }

  /** Aggiorna e sostituisce le room con quelle restituiti dal server */
  fetchRooms(): Observable<Room[]> {
    return this.http
      .get<ResponseRoom[]>('https://www.collaudolive.com:9083/s/room/')
      .pipe(
        // Rimappa i dati che arrivano dal server sull'interfaccia della Room
        map((resData: ResponseRoom[]) => {
          const rooms: Room[] = [];
          for (const key in resData) {
            // console.log("Key:", key," - ","ResData[key]",resData[key]);
            // resData.hasOwnProperty(key) = iterate all enumerable properties, directly on the object (not on the prototype)
            if (resData.hasOwnProperty(key)) { 
              rooms.push({
                id:                 resData[key].id,
                usermobile:         resData[key].usermobile,
                nome_progetto:      resData[key].progettoselezionato,
                nome_collaudatore:  resData[key].collaudatoreufficio,
                data_inserimento:   resData[key].DataInsert,
              });
            }
          }
          return rooms;
        }),
        // emette il nuovo array come valore del BehaviourSubject _rooms
        tap((rooms: Room[]) => { this._rooms.next(rooms); })
      );
  }

  updateRoom(id: number, usermobile: string) {
    const headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.put<Room>('https://www.collaudolive.com:9083/u/multistreaming/' + id + '/' + usermobile, { headers });
  }
}
