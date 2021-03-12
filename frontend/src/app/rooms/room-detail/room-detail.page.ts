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
  isLoading = false;

  constructor(
    private activatedRouter: ActivatedRoute,
    private roomsService: RoomService,
    private navController: NavController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.activatedRouter.paramMap.subscribe(paramMap => {
      if (!paramMap.has('roomId')) {
        this.navController.navigateBack(['/rooms']);
        return;
      }

      // mi sottoscrivo all'osservabile "getRoom()" che restituisce una singola room per ID
      this.isLoading = true;
      this.sub = this.roomsService.getRoom(paramMap.get('roomId'))
      .subscribe(
        (room: Room) => { 
          this.room = room; 
          this.isLoading = false;
        }, 
        error => {
          this.alertController.create({
            header: 'Errore', 
            message:'Impossibiile caricare la room', 
            buttons : [{
              text: 'Annulla', handler: () => {
                this.navController.navigateBack(['/rooms']);
                // this.router.navigate(['/rooms']);
              }
            }]
          }).then(alertEl => {
            alertEl.present();
          })
        }
      );
    });
  }

  ngOnDestroy() {
    if(this.sub) { this.sub.unsubscribe; }
  }
}
