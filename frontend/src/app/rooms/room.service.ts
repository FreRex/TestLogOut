import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../admin/users-tab/user.service';

/** Interfaccia che definisce la Room come mi arriva sul JSON */
export interface RoomData {
  id: number;
  cod: string,
  usermobile: string;
  progettoselezionato: string;
  collaudatoreufficio: string;
  DataInsert: string;
  idcommessa: number;
  commessa: string;
}

/** Interfaccia che definisce la Room all'interno del progetto */
export interface Room {
  id: number;
  pk_project: string;
  usermobile: string;
  progetto: string;
  collaudatore: string;
  data_inserimento: Date;
  idcommessa: number;
  commessa: string;
}

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) { }

  private roomsSubject = new BehaviorSubject<Room[]>([]);  // <-- "roomsSubject" può emettere eventi perchè è un BehaviourSubject
  rooms$: Observable<Room[]> = this.roomsSubject.asObservable(); // <-- "rooms$" NON può emettere eventi, ma può essere sottoscritto, perchè è un Observable

  getRoom(roomId: number): Observable<Room> {
    return this.rooms$
      .pipe(
        take(1),
        // <-- applico una funzione di filtro all'array di room che ho preso con take(1)
        map((rooms: Room[]) => {
          // <-- ritorna vero quando trova il progeto giusto
          return { ...rooms.find(room => room.id === roomId) };
        }));
  }

  getRoomsByFilter(query: string): Observable<Room[]> {
    return this.rooms$.pipe(
      map(rooms =>
        rooms.filter(room =>
          room.usermobile.toLowerCase().includes(query.toLowerCase()) ||
          room.commessa.toLowerCase().includes(query.toLowerCase()) ||
          room.progetto.toString().toLowerCase().includes(query.toLowerCase()) ||
          room.collaudatore.toString().toLowerCase().includes(query.toLowerCase())
        )
      )
    );
  }

  /** SELECT singola room */
  selectRoom(roomId: string): Observable<Room> {
    return this.http
      .get<RoomData>(
        `${environment.apiUrl}/s/room/${this.authService.userCod}/${roomId}`,
        { headers: new HttpHeaders().set('Authorization', `Bearer ${this.authService.token}`) }
      )
      .pipe(
        map(roomData => {
          return {
            id: roomData[0].id,
            pk_project: roomData[0].cod,
            usermobile: roomData[0].usermobile,
            progetto: roomData[0].progettoselezionato,
            collaudatore: roomData[0].collaudatoreufficio,
            data_inserimento: new Date(roomData[0].DataInsert),
            idcommessa: roomData[0].idcommessa,
            commessa: roomData[0].commessa,
          }
        })
      );
  }

  /** SELECT rooms */
  loadRooms(): Observable<Room[]> {
    return this.http
      .get<{ [key: string]: RoomData }>(
        `${environment.apiUrl}/s/room/${this.authService.userCod}/0`,
        { headers: new HttpHeaders().set('Authorization', `Bearer ${this.authService.token}`) }
      )
      .pipe(
        // <-- Rimappa i dati che arrivano dal server sull'interfaccia della Room
        map((roomData: { [key: string]: RoomData }) => {
          const rooms: Room[] = [];
          for (const key in roomData) {
            // console.log("Key:", key," - ","Res[key]",res[key]);
            // resData.hasOwnProperty(key) = iterate all enumerable properties, directly on the object (not on the prototype)
            if (roomData.hasOwnProperty(key)) {
              rooms.push({
                id: roomData[key].id,
                pk_project: roomData[key].cod,
                usermobile: roomData[key].usermobile,
                progetto: roomData[key].progettoselezionato,
                collaudatore: roomData[key].collaudatoreufficio,
                data_inserimento: new Date(roomData[key].DataInsert),
                idcommessa: roomData[key].idcommessa,
                commessa: roomData[key].commessa,
              });
            }
          }
          return rooms;
        }),
        // <-- emette il nuovo array come valore del BehaviourSubject _rooms
        tap((rooms: Room[]) => this.roomsSubject.next(rooms))
      );
  }

  /** CREATE room e aggiungila alla lista */
  addRoom(
    pk_project: string,
    usermobile: string,
    progetto: string,
    idutente: number,
    collaudatore: string,
    idcommessa: number,
    commessa: string,
  ) {
    let updatedRooms: Room[];
    const newRoom =
    {
      id: null,
      pk_project: pk_project,
      usermobile: usermobile,
      progetto: progetto,
      collaudatore: collaudatore,
      data_inserimento: new Date(),
      idcommessa: idcommessa,
      commessa: commessa
    };
    // this.rooms è un OSSERVABILE
    // take(1) = dopo la prima emissione dell'Osservabile togli la sottoscrizione
    // tap() = applico una funzione all'array emesso dall'osservabile (solo 1 perchè uso take(1)) senza sottoscrivermi
    return this.rooms$
      .pipe(
        take(1),
        switchMap(rooms => {
          updatedRooms = [...rooms];
          return this.http
            .post(
              `${environment.apiUrl}/cr/`,
              {
                "usermobile": usermobile,
                "progettoselezionato": progetto,
                "cod": pk_project,
                "collaudatoreufficio": idutente,
              },
              { headers: new HttpHeaders().set('Authorization', `Bearer ${this.authService.token}`) }
            );
        }),
        catchError(err => { return throwError(err); }),
        tap(res => {
          console.log('GeneratedId:', res['insertId']);
          newRoom.id = res['insertId'];
          updatedRooms.unshift(newRoom);
          // this._rooms è un BEHAVIOUR SUBJECT
          // next() = emetto il nuovo array concatencato come prossimo elemento del BehaviourSubject 
          // concat(newRoom) = prendo il vecchio array emesso dall'osservabile e concateno il nuovo elemento
          this.roomsSubject.next(updatedRooms);
        })
      );
  }

  /** UPDATE room */
  updateRoom(
    roomId: number,
    newUsermobile: string
  ) {
    let updatedRooms: Room[];
    return this.rooms$
      .pipe(
        take(1),
        switchMap(rooms => {
          // findIndex() = trova l'indice di un elemento di un array in base a una regola ("se è vero")
          const roomIndex = rooms.findIndex(room => room.id === roomId);
          updatedRooms = [...rooms];
          const oldRoom = updatedRooms[roomIndex];
          updatedRooms[roomIndex] =
          {
            id: oldRoom.id,
            pk_project: oldRoom.pk_project,
            usermobile: newUsermobile,
            progetto: oldRoom.progetto,
            collaudatore: oldRoom.collaudatore,
            data_inserimento: oldRoom.data_inserimento,
            idcommessa: oldRoom.idcommessa,
            commessa: oldRoom.commessa
          };
          return this.http
            .put(
              `${environment.apiUrl}/ur`,
              {
                "id": roomId,
                "usermobile": newUsermobile
              },
              { headers: new HttpHeaders().set('Authorization', `Bearer ${this.authService.token}`) }
            );
        }),
        catchError(err => { return throwError(err); }),
        tap(res => { this.roomsSubject.next(updatedRooms); })
      );
  }

  /** DELETE room */
  deleteRoom(roomId: number) {
    let updatedRooms: Room[];
    return this.rooms$
      .pipe(
        take(1),
        switchMap(rooms => {
          // filter() = filtra un array in base a una regola ("se è vero")
          // ritrorna vero per tutte le room tranne quella che voglio scartare
          updatedRooms = rooms.filter(room => room.id !== roomId);
          return this.http
            .post(
              `${environment.apiUrl}/d/`,
              {
                "id": roomId,
                "tableDelete": "multistreaming"
              },
              { headers: new HttpHeaders().set('Authorization', `Bearer ${this.authService.token}`) }
            )
        }),
        catchError(err => { return throwError(err); }),
        tap(res => { this.roomsSubject.next(updatedRooms); })
      );
  }

  checkDownload(nomeProgetto: string) {
    return this.http.get(
      `${environment.apiUrl}/checkdownloadzip/${nomeProgetto}`,
      { headers: new HttpHeaders().set('Authorization', `Bearer ${this.authService.token}`) });
  }

  downloadFoto(nomeProgetto: string) {
    return this.http.get(
      `${environment.apiUrl}/downloadzip/${nomeProgetto}`,
      {
        // responseType: 'arraybuffer',
        // reportProgress: true,
        // observe: 'events',
        headers: new HttpHeaders().set('Authorization', `Bearer ${this.authService.token}`)
      }
    );
  }

}
