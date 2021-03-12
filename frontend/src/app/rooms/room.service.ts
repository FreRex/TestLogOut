import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, map, switchMap, take, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { environment } from 'src/environments/environment';

/** Interfaccia che definisce la Room all'interno del progetto */
export interface Room {
  id: string;
  usermobile: string;
  nome_progetto: string;
  nome_collaudatore: string;
  data_inserimento: Date;
  // public pk_project?: number,
  // public commessa?: string,
}

/** Interfaccia che definisce la Room come mi arriva sul JSON */
export interface RoomData {
  id: string;
  usermobile: string;
  // API Firebase
  nome_progetto: string;
  nome_collaudatore: string;
  data_inserimento: string;
  // API Frex
  // progettoselezionato: string;
  // collaudatoreufficio: string;
  // DataInsert: string;
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

  /** Lista delle room sotto forma di BehaviourSubject */
  private _rooms = new BehaviorSubject<Room[]>([]);  // <-- "_rooms" può emettere eventi perchè è un BehaviourSubject

  /** Ritorna la lista di tutti i progetti come Osservabile */
  get rooms(): Observable<Room[]> {
    return this._rooms.asObservable();            // <-- "rooms" NON può emettere eventi, ma può essere sottoscritto, perchè è un Observable
  }

  /** Ritorna una singola room sotto forma di Osservabile */
  getRoom(roomId: string): Observable<Room> {
    return this.http.get<RoomData>(`${environment.apiUrl}/rooms/${roomId}.json`)
      .pipe(
        map(roomData => {
          return {
            id: roomId,
            usermobile: roomData.usermobile,
            // API Firebase
            nome_progetto: roomData.nome_progetto,
            nome_collaudatore: roomData.nome_collaudatore,
            data_inserimento: new Date(roomData.data_inserimento),
          }
        })
      );
    // return this.rooms.pipe(take(1),
    //   map((rooms: Room[]) => {                              // <-- applico una funzione di filtro all'array di room che ho preso con take(1)
    //     return { ...rooms.find(room => room.id === roomId) };   // <-- ritorna vero quando trova il progeto giusto
    //   }));
  }

  constructor(private http: HttpClient, private authService: AuthService) { }

  /** Aggiunge una nuova room alla lista */
  addRoom(usermobile: string, nome_progetto: string, nome_collaudatore: string) {
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
    // Firebase resonse --> Object { name: "-MVS4EJcaH_E95wHB6Yt" }
    return this.http.post<{ name: string }>(`${environment.apiUrl}/rooms.json`, newRoom)
      .pipe(
        switchMap((resData: { name: string }) => {
          generatedId = resData.name;
          return this.rooms;
        }),
        take(1),
        tap(rooms => {
          console.log('GeneratedId:', generatedId);
          newRoom.id = generatedId;
          // this._rooms è un BEHAVIOUR SUBJECT
          // next() = emetto il nuovo array concatencato come prossimo elemento del BehaviourSubject 
          // concat(newRoom) = prendo il vecchio array emesso dall'osservabile e concateno il nuovo elemento
          this._rooms.next(rooms.concat(newRoom));
        }));

    // return this.rooms.pipe(take(1), tap((rooms: Room[]) => {}));
  }

  /** Cancella una room */
  deleteRoom(roomId: string) {
    return this.http.delete(`${environment.apiUrl}/rooms/${roomId}.json`)
      .pipe(
        switchMap(() => {
          return this.rooms;
        }),
        take(1),
        tap(rooms => {
          console.log(rooms);
          
          // filter() = filtra un array in base a una regola ("se è vero")
          // ritrorna vero per tutte le room tranne quella che voglio scartare
          const updatedRooms = rooms.filter(room => room.id !== roomId);
          this._rooms.next(updatedRooms);
        })
      );
  }

  /** Salva una room dopo una modifica */
  updateRoom(roomId: string, newUsermobile: string) {
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
        return this.http.put(`${environment.apiUrl}/rooms/${roomId}.json`,
          { ...updatedRooms[updatedRoomIndex] });
      }),
      tap(res => {
        this._rooms.next(updatedRooms);
      }));
  }

  /** Aggiorna e sostituisce le room con quelle restituiti dal server */
  fetchRooms(): Observable<Room[]> {
    return this.http
      // WHY : { [key: string]: RoomData } al posto di RoomData[] ???
      .get<{ [key: string]: RoomData }>(`${environment.apiUrl}/rooms.json`)
      .pipe(
        // Rimappa i dati che arrivano dal server sull'interfaccia della Room
        map((resData: { [key: string]: RoomData }) => {
          const rooms: Room[] = [];
          for (const key in resData) {
            // console.log("Key:", key," - ","Res[key]",res[key]);
            // resData.hasOwnProperty(key) = iterate all enumerable properties, directly on the object (not on the prototype)
            if (resData.hasOwnProperty(key)) {
              rooms.push({
                id: key,
                usermobile: resData[key].usermobile,
                // API Firebase
                nome_progetto: resData[key].nome_progetto,
                nome_collaudatore: resData[key].nome_collaudatore,
                data_inserimento: new Date(resData[key].data_inserimento),
                // API Frex
                // nome_progetto: resData[key].progettoselezionato,
                // nome_collaudatore: resData[key].collaudatoreufficio,
                // data_inserimento: new Date(resData[key].DataInsert),
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
}
