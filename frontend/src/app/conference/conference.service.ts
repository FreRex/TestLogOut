import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { Room } from '../rooms/room.service';

export interface RoomUser {
  idutente: string;
  nome: string;
  // iniziali: string;
  socketid: string;
  stream: boolean;
  audio: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ConferenceService {
  constructor(private http: HttpClient, private authService: AuthService) {}
}
