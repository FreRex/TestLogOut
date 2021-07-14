import { Component, Input, OnInit } from '@angular/core';
import { combineLatest, forkJoin, Observable, pipe, zip } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  startWith,
  take,
  tap,
} from 'rxjs/operators';
import { AudioRTCService } from 'src/app/test-audiortc/audiortc.service';

import { RoomUser } from '../conference.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
})
export class UsersListComponent implements OnInit {
  @Input() usersInRoom: RoomUser[];
  @Input() watchers$: Observable<RoomUser[]>;

  roomUsers$: Observable<RoomUser[]>;

  constructor(public audioService: AudioRTCService) {}

  ngOnInit() {
    // this.isAudioOn;
    // this.audioService.listeners$.subscribe((listeners) => {
    //   console.log('🐱‍👤 : listeners', listeners);
    // });

    // this.roomUsers$.subscribe((roomUsers) => {
    //   console.log('🐱‍👤 : roomUsers', roomUsers);
    // });

    this.roomUsers$ = combineLatest([
      this.audioService.listeners$,
      this.watchers$,
    ]).pipe(
      map(([listeners, watchers]) => {
        console.log('🐱‍👤 : watchers', watchers);
        console.log('🐱‍👤 : listeners', listeners);
        let roomUsers: RoomUser[] = [];
        watchers.forEach((watcher) => {
          roomUsers.push({
            idutente: watcher.idutente,
            nome: watcher.nome,
            stream: watcher.stream,
            audioStream: listeners.find(
              (listener) => listener.id === watcher.idutente
            ),
            // audioStream: listeners.map((listener) =>
            //   listener.id === watcher.idutente
            //     ? listener.stream
            //       ? listener.stream
            //       : null
            //     : null
            // ),
          });
        });
        return roomUsers;
      }),
      tap((roomUsers) => {
        console.log('🐱‍👤 : roomUsers', roomUsers);
      })
    );
  }

  // isAudioOn(roomUser: RoomUser): void {
  //   if (roomUser) {
  //     this.audioService.listeners$
  //       .pipe(
  //         tap(console.log),
  //         filter(
  //           (streams) =>
  //             streams.filter((res) => res.id === roomUser.idutente).length > 0
  //         ),
  //         map((res) => (res.length > 0 ? true : false))
  //       )
  //       .subscribe((res) => {
  //         this.usersInRoom?.forEach((user) => {
  //           if (user.idutente === roomUser.idutente) {
  //             user.audio = res;
  //           }
  //         });
  //       });
  //   }
  // }
}
