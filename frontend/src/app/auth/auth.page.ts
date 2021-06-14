import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Room, RoomService } from '../rooms/room.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  public room: Room;
  public directLink: boolean = true;
  constructor(private activatedRoute: ActivatedRoute, private roomService: RoomService) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params && params['room']) {
        this.room = params['room'];
        // !! TODO: recupera dati room per avere i dettagli
        // !! non funziona perchè non ho il token prima di aver effettuato il login!
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent?retiredLocale=it
        this.roomService.selectRoom(params['room']).subscribe((res) => console.log(res));
      }
    });
  }
}
