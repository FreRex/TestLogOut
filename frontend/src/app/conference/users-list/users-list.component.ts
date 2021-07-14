import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
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

  constructor(public audioService: AudioRTCService) {}

  ngOnInit() {
    // this.isAudioOn;
    this.audioService.listeners$.subscribe(
      (res) => {
        console.log(res);
      },
      (err) => {
        console.log(err);
      }
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
