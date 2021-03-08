import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Room } from './room.model';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  private _rooms: Room[] = [
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
  ];

  roomsChanged = new Subject<Room[]>();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  /** Ritorna tutti i progetti */
  getRooms() {
    return this._rooms.slice();  // <-- slice() = crea una copia dell'array
    // return [...this.rooms];        // <-- Spread Operator = ritorna i singoli valori dell'array = crea una copia dell'array
  }

  // getRoomsFiltered(collaudatore: string) {
  //   return {
  //     ...this._rooms.filter(room => {
  //       return room.nome_collaudatore === collaudatore;
  //     })
  //   };
  // }

  // TODO : sostituire proprietà id del progetto a usermobile
  getRoomById(id: string): Room {
    return {
      ...this._rooms.find(room => {   // <-- ritorna una copia del progetto con lo spread operator
        return room.usermobile === id;  // <-- ritorna vero quando trova il progeto giusto
      })
    };
  }

  /** Cancella un progetto */
  deleteRoom(id: string) {
    this._rooms = this._rooms.filter(room => {  // <-- filter() = filtra un array in base a una regola ("se è vero")
      return room.usermobile !== id;                // <-- ritrorna vero per tutte le ricette tranne quella che voglio scartare
    });
    this.roomsChanged.next(this._rooms.slice());
  }

  /** Salva un progetto dopo una modifica */
  saveRoom(id: number, usermobile: string, nome_progetto: string, nome_collaudatore: string) {
    const index = this._rooms.findIndex(room => {
      return room.usermobile === usermobile;
    });
    this._rooms[index] = new Room(id, usermobile, nome_progetto, nome_collaudatore, new Date());
    this.roomsChanged.next(this._rooms.slice());
  }

  // createRoom(newRoom: Room) {
  //   this._rooms.push(newRoom);
  //   this.roomsChanged.next(this._rooms.slice());
  // }

  /** Aggiunge un nuovo progetto alla lista */
  addRoom(id: number, usermobile: string, nome_progetto: string, nome_collaudatore: string) {
    const newRoom = new Room(id, usermobile, nome_progetto, nome_collaudatore, new Date());
    this._rooms.push(newRoom);
    this.roomsChanged.next(this._rooms.slice());
  }

  /** Aggiorna e sostituisce i progetti con quelli restituiti dal server */
  fetchRooms() {
    this._rooms = [];

    return this.http
      .get<Room>(
        'https://www.collaudolive.com:9083/s/room/'
      )
      .pipe(
        map(
          resData => {
            for (const key in resData) {
              console.log(key);
              console.log(resData[key]);
              if (resData.hasOwnProperty(key)) {
                this._rooms.push(
                  new Room(
                    resData[key].id,
                    resData[key].usermobile,
                    resData[key].progettoselezionato,
                    resData[key].collaudatoreufficio,
                    resData[key].DataInsert,
                    )
                  );
              }
            }
          }
        )
      );
  }

}
