import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../backoffice/users/user.service';

/** Interfaccia che definisce la Room all'interno del progetto */
export interface Room {
  id: number;
  projectID: string;
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
  cod: string,
  usermobile: string;
  progettoselezionato: string;
  collaudatoreufficio: string;
  DataInsert: string;
}

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private userService: UserService
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
          room.nome_progetto.toString().toLowerCase().includes(query.toLowerCase()) ||
          room.nome_collaudatore.toString().toLowerCase().includes(query.toLowerCase())
        )
      )
    );
  }

  // getRooms(): Observable<Room[]> {
  //   return this.rooms$
  //     .pipe(
  //       switchMap(rooms => {
  //         if (!rooms || rooms.length <= 0) { return this.loadRooms(); }
  //         else { return of(rooms); }
  //       })
  //     );
  // }

  /** SELECT singola room */
  selectRoom(roomId: string): Observable<Room> {
    return this.http
      .get<RoomData>(
        `${environment.apiUrl}/s/room/${roomId}`,
        { headers: new HttpHeaders().set('Authorization', `Bearer ${this.authService.token}`) }
      )
      .pipe(
        map(roomData => {
          return {
            id: roomData[0].id,
            projectID: roomData[0].cod,
            usermobile: roomData[0].usermobile,
            nome_progetto: roomData[0].progettoselezionato,
            nome_collaudatore: roomData[0].collaudatoreufficio,
            data_inserimento: new Date(roomData[0].DataInsert),
          }
        })
      );
  }

  /** SELECT rooms */
  loadRooms(): Observable<Room[]> {
    // console.log("User:", this.authService.userId);
    return this.http
      .get<{ [key: string]: RoomData }>(
        `${environment.apiUrl}/s/room/${this.authService.userId}/0`,
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
                projectID: roomData[key].cod,
                usermobile: roomData[key].usermobile,
                nome_progetto: roomData[key].progettoselezionato,
                nome_collaudatore: roomData[key].collaudatoreufficio,
                data_inserimento: new Date(roomData[key].DataInsert),
              });
            }
          }
          return rooms;
        }),
        // <-- emette il nuovo array come valore del BehaviourSubject _rooms
        tap((rooms: Room[]) => { this.roomsSubject.next(rooms); })
      );
  }

  /** CREATE room e aggiungila alla lista */
  addRoom(
    projectID: string,
    usermobile: string,
    nome_progetto: string,
    nome_collaudatore: string
  ) {
    let updatedRooms: Room[];
    const newRoom =
    {
      id: null,
      projectID: projectID,
      usermobile: usermobile,
      nome_progetto: nome_progetto,
      nome_collaudatore: nome_collaudatore,
      data_inserimento: new Date()
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
                "progettoselezionato": nome_progetto,
                "cod": projectID,
                "collaudatoreufficio": this.userService.getUserIdByName(nome_collaudatore),
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
            projectID: oldRoom.projectID,
            usermobile: newUsermobile,
            nome_progetto: oldRoom.nome_progetto,
            nome_collaudatore: oldRoom.nome_collaudatore,
            data_inserimento: oldRoom.data_inserimento,
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

}
