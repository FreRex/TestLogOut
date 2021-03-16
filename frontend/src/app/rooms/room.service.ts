import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, delay, map, switchMap, take, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { environment } from 'src/environments/environment';

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
export interface RoomData {
  id: number;
  usermobile: string;
  progettoselezionato: string;
  collaudatoreufficio: string;
  DataInsert: string;
}

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  // dummyRooms: Room[] = [
  //   {
  //     id: 1,
  //     usermobile: '1',
  //     nome_progetto: 'Progetto 1',
  //     nome_collaudatore: 'Collaudatore 1',
  //     data_inserimento: new Date(2021, 3, 1),
  //   },
  //   {
  //     id: 2,
  //     usermobile: '2',
  //     nome_progetto: 'Progetto 2',
  //     nome_collaudatore: 'Collaudatore 2',
  //     data_inserimento: new Date(2021, 3, 2),
  //   },
  //   {
  //     id: 3,
  //     usermobile: '3',
  //     nome_progetto: 'Progetto 3',
  //     nome_collaudatore: 'Collaudatore 3',
  //     data_inserimento: new Date(2021, 3, 3),
  //   }
  // ];

  constructor(private http: HttpClient, private authService: AuthService) { }

  /** Lista delle room sotto forma di BehaviourSubject */
  private _rooms = new BehaviorSubject<Room[]>([]);  // <-- "_rooms" può emettere eventi perchè è un BehaviourSubject

  /** Ritorna la lista di tutti i progetti come Osservabile */
  get rooms(): Observable<Room[]> {
    return this._rooms.asObservable();            // <-- "rooms" NON può emettere eventi, ma può essere sottoscritto, perchè è un Observable
  }

  /** SELECT rooms */
  fetchRooms(): Observable<Room[]> {
    return this.http
      // WHY : { [key: string]: RoomData } al posto di RoomData[] ???
      .get<{ [key: string]: RoomData }>(`${environment.apiUrl}/s/room/`)
      .pipe(
        // Rimappa i dati che arrivano dal server sull'interfaccia della Room
        map((roomData: { [key: string]: RoomData }) => {
          const rooms: Room[] = [];
          for (const key in roomData) {
            // console.log("Key:", key," - ","Res[key]",res[key]);
            // resData.hasOwnProperty(key) = iterate all enumerable properties, directly on the object (not on the prototype)
            if (roomData.hasOwnProperty(key)) {
              rooms.push({
                id: roomData[key].id,
                usermobile: roomData[key].usermobile,
                nome_progetto: roomData[key].progettoselezionato,
                nome_collaudatore: roomData[key].collaudatoreufficio,
                data_inserimento: new Date(roomData[key].DataInsert),
              });
            }
          }
          return rooms;
        }),
        delay(1000),
        // emette il nuovo array come valore del BehaviourSubject _rooms
        tap((rooms: Room[]) => { this._rooms.next(rooms); })
      );
  }

  /** SELECT singola room */
  getRoom(roomId: string): Observable<Room> {
    return this.http.get<RoomData>(`${environment.apiUrl}/s/room/${roomId}`)
      .pipe(
        map(roomData => {
          return {
            id: roomData[0].id,
            usermobile: roomData[0].usermobile,
            nome_progetto: roomData[0].progettoselezionato,
            nome_collaudatore: roomData[0].collaudatoreufficio,
            data_inserimento: new Date(roomData[0].DataInsert),
          }
        })
      );
    // return this.rooms.pipe(take(1),
    //   map((rooms: Room[]) => {                              // <-- applico una funzione di filtro all'array di room che ho preso con take(1)
    //     return { ...rooms.find(room => room.id === roomId) };   // <-- ritorna vero quando trova il progeto giusto
    //   }));
  }

  /** CREATE room e aggiungila alla lista */
  addRoom(usermobile: string, nome_progetto: string, nome_collaudatore: string) {
    let updatedRooms: Room[];
    const newRoom =
    {
      id: null,
      usermobile: usermobile,
      nome_progetto: nome_progetto,
      nome_collaudatore: nome_collaudatore,
      data_inserimento: new Date()
    };
    let generatedId: string;

    // this.rooms è un OSSERVABILE
    // take(1) = dopo la prima emissione dell'Osservabile togli la sottoscrizione
    // tap() = applico una funzione all'array emesso dall'osservabile (solo 1 perchè uso take(1)) senza sottoscrivermi
    return this.rooms.pipe(
      take(1),
      switchMap(rooms => {
        if (!rooms || rooms.length <= 0) {
          return this.fetchRooms();
        } else {
          return of(rooms);
        }
      }),
      switchMap(rooms => {
        updatedRooms = [...rooms];
        return this.http.post(`${environment.apiUrl}/cr/`,
          {
            "usermobile": usermobile,
            "progettoselezionato": nome_progetto,
            // "collaudatoreufficio": nome_collaudatore
          })
      }),
      catchError(err => { return throwError(err); }),
      tap(res => {
        console.log('GeneratedId:', res['insertId']);
        newRoom.id = res['insertId'];
        // this._rooms è un BEHAVIOUR SUBJECT
        // next() = emetto il nuovo array concatencato come prossimo elemento del BehaviourSubject 
        // concat(newRoom) = prendo il vecchio array emesso dall'osservabile e concateno il nuovo elemento
        this._rooms.next(updatedRooms.concat(newRoom));
      })
    );
    // Firebase resonse --> Object { name: "-MVS4EJcaH_E95wHB6Yt" }
    // return this.http.post<{ name: string }>(`${environment.apiUrl}/rooms.json`, newRoom)
    //   .pipe(
    //     switchMap((resData: { name: string }) => {
    //       generatedId = resData.name;
    //       return this.rooms;
    //     }),
    //     take(1),
    //     tap(rooms => {
    //       console.log('GeneratedId:', generatedId);
    //       newRoom.id = generatedId;
    //       // this._rooms è un BEHAVIOUR SUBJECT
    //       // next() = emetto il nuovo array concatencato come prossimo elemento del BehaviourSubject 
    //       // concat(newRoom) = prendo il vecchio array emesso dall'osservabile e concateno il nuovo elemento
    //       this._rooms.next(rooms.concat(newRoom));
    //     }));
  }

  /** UPDATE room dopo una modifica */
  updateRoom(roomId: number, newUsermobile: string) {
    let updatedRooms: Room[];
    return this.rooms.pipe(
      take(1),
      switchMap(rooms => {
        if (!rooms || rooms.length <= 0) {
          return this.fetchRooms();
        } else {
          return of(rooms);
        }
      }),
      switchMap(rooms => {
        // findIndex() = trova l'indice di un elemento di un array in base a una regola ("se è vero")
        const updatedRoomIndex = rooms.findIndex(room => room.id === roomId);
        updatedRooms = [...rooms];
        const oldRoom = updatedRooms[updatedRoomIndex];
        updatedRooms[updatedRoomIndex] =
        {
          id: oldRoom.id,
          usermobile: newUsermobile,
          nome_progetto: oldRoom.nome_progetto,
          nome_collaudatore: oldRoom.nome_collaudatore,
          data_inserimento: oldRoom.data_inserimento,
        };
        return this.http.put(`${environment.apiUrl}/ur`,
          {
            "id": roomId,
            "usermobile": newUsermobile
          });
      }),
      catchError(err => { return throwError(err); }),
      tap(res => { this._rooms.next(updatedRooms); })
    );
  }

  /** DELETE room */
  deleteRoom(roomId: number) {
    let updatedRooms: Room[];
    return this.rooms.pipe(
      take(1),
      switchMap(rooms => {
        if (!rooms || rooms.length <= 0) {
          return this.fetchRooms();
        } else {
          return of(rooms);
        }
      }),
      switchMap(rooms => {
        // filter() = filtra un array in base a una regola ("se è vero")
        // ritrorna vero per tutte le room tranne quella che voglio scartare
        updatedRooms = rooms.filter(room => room.id !== roomId);
        return this.http.post(`${environment.apiUrl}/d/`,
          {
            "id": roomId,
            "tableDelete": "multistreaming"
          })
      }),
      catchError(err => { return throwError(err); }),
      tap(res => { this._rooms.next(updatedRooms); })
    );
  }
}
