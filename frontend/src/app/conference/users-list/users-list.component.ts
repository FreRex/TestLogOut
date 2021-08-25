import { Component, OnInit } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AudioRTCService, Listener } from 'src/app/conference/audio-rtc.service';

import { RoomUser } from '../room-user';
import { StreamingRtmpService } from '../streaming-rtmp.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
})
export class UsersListComponent implements OnInit {
  // @Input() usersInRoom: RoomUser[];
  // @Input() watchers$: Observable<RoomUser[]>;

  roomUsers$: Observable<RoomUser[]>;

  constructor(
    public audioService: AudioRTCService,
    public streamingService: StreamingRtmpService
  ) {}

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
      this.streamingService.watchers$,
    ]).pipe(
      map(([listeners, watchers]) => {
        // console.log('🐱‍👤 : watchers', watchers);
        // console.log('🐱‍👤 : listeners', listeners);
        let roomUsers: RoomUser[] = [];
        watchers.forEach((watcher) => {
          let listener = listeners.find(
            (listener) => listener.id === watcher.idutente
          );
          roomUsers.push({
            idutente: watcher.idutente,
            nome: watcher.nome,
            stream: watcher.stream,
            audioOn: !!listener,
            audioStream: this.getAudioStream(listener),
          });
        });
        return roomUsers;
      }),
      tap((roomUsers) => {
        // console.log('🐱‍👤 : roomUsers', roomUsers);
      })
    );
  }

  getAudioStream(listener: Listener): MediaStream {
    if (listener) {
      return listener.stream ? listener.stream : null;
    } else {
      return null;
    }
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
