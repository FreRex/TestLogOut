import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Room, RoomService } from '../room.service';

@Component({
  selector: 'app-room-detail',
  templateUrl: './room-detail.page.html',
  styleUrls: ['./room-detail.page.scss'],
})
export class RoomDetailPage implements OnInit, OnDestroy {

  private sub: Subscription;
  room: Room;

  constructor(
    private activatedRouter: ActivatedRoute,
    private roomsService: RoomService,
    private navController: NavController,
  ) { }

  ngOnInit() {
    this.activatedRouter.paramMap.subscribe(paramMap => {
      if (!paramMap.has('roomId')) {
        this.navController.navigateBack(['/rooms']);
        return;
      }
      const roomId = paramMap.get('roomId');

      // mi sottoscrivo all'osservabile "getRoom()" che restituisce una singola room per ID
      this.sub = this.roomsService.getRoom(roomId).subscribe(
        (room: Room) => { this.room = room; }
      );

    });
  }

  ngOnDestroy() {
    if(this.sub) { this.sub.unsubscribe; }
  }
}
