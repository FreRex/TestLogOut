import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { AuthService } from '../auth/auth.service';
import { Room, RoomData } from '../rooms/room.service';

export interface RoomUser {
  idutente: string;
  nome: string;
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

  randomId(length: number): string {
    var result = '';
    var characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    console.log('🐱‍👤 : AuthService : result', result);
    return result;
  }
}
