import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { AuthService } from '../auth/auth.service';
import { Room, RoomData } from '../rooms/room.service';

export interface RoomUser {
  idutente: string;
  iniziali: string;
  socketid: string;
  stream: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ConferenceService {
  private currentRoomSubject = new BehaviorSubject<Room>(null); // <-- "roomsSubject" può emettere eventi perchè è un BehaviourSubject
  currentRoom$: Observable<Room> = this.currentRoomSubject.asObservable(); // <-- "rooms$" NON può emettere eventi, ma può essere sottoscritto, perchè è un Observable

  private currentUsersInRoomSubject = new BehaviorSubject<RoomUser[]>(null); // <-- "roomsSubject" può emettere eventi perchè è un BehaviourSubject
  currentUsersInRoom$: Observable<RoomUser[]> =
    this.currentUsersInRoomSubject.asObservable(); // <-- "rooms$" NON può emettere eventi, ma può essere sottoscritto, perchè è un Observable

  constructor(private http: HttpClient, private authService: AuthService) {}

  updateUsersInRoom() {
    // TODO: per aggiornare meglio la UI dei cambiamenti??
  }

  /** SELECT singola room */
  selectRoom(roomId: number): Observable<Room> {
    return this.authService.currentUser$.pipe(
      take(1),
      switchMap((user) => {
        // return this.http.get<RoomData>(`${environment.apiUrl}/s/room/${user.idutcas}/${roomId}`);
        return this.http.get<RoomData>(
          `${environment.apiUrl}/s/room/0/${roomId}`
        );
      }),
      map((roomData) => {
        return {
          id: roomData[0].id,
          usermobile: roomData[0].usermobile,
          data_inserimento: new Date(roomData[0].DataInsert),
          pk_project: roomData[0].cod,
          progetto: roomData[0].progettoselezionato,
          data_sincronizzazione: new Date(roomData[0].dataLastsincro),
          idutente: roomData[0].idutente,
          collaudatore: roomData[0].collaudatoreufficio,
          idcommessa: roomData[0].idcommessa,
          commessa: roomData[0].commessa,
          sessione: 'Mattina',
        };
      }),
      // <-- emette il nuovo array come valore del BehaviourSubject _rooms
      tap((room: Room) => this.currentRoomSubject.next(room))
    );
  }

  deselectRoom() {
    this.currentRoomSubject.next(null);
  }
}
