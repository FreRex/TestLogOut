import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonSelect, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Room } from './room.model';
import { RoomService } from './room.service';
import { EditRoomModalComponent } from './edit-room-modal/edit-room-modal.component';

@Component({
  selector: 'app-room',
  templateUrl: './rooms.page.html',
  styleUrls: ['./rooms.page.scss'],
})
export class RoomsPage implements OnInit, OnDestroy {

  rooms: Room[];
  subscription: Subscription;
  isSearchMode: boolean = false;
  filteredRooms = [];

  constructor(
    private modalController: ModalController,
    private roomService: RoomService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.subscription = this.roomService.roomsChanged.subscribe(
      (rooms: Room[]) => {
        this.rooms = rooms;
      });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  // ??? mi serve ancora o posso accorparlo al ngOnInit?
  ionViewWillEnter() {
    this.rooms = this.roomService.getRooms();
    this.filteredRooms = this.rooms;
  }

  doRefresh(event) {
    this.roomService.fetchRooms()
      .subscribe(
        res => {
          this.rooms = this.roomService.getRooms();
          this.filteredRooms = this.rooms;
          event.target.complete();
        }
      );
  }

  /** Funzione che filtra i progetti in base al fitro impostato e all'input */
  onFilter(eventValue: Event, filterValue: string) {
    let searchTerm = (<HTMLInputElement>eventValue.target).value;
    switch (filterValue) {
      case "collaudatore": {
        this.filteredRooms = this.rooms.filter((room) => {
          return room.nome_collaudatore.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
        });
        break;
      }
      case "usermobile": {
        this.filteredRooms = this.rooms.filter((room) => {
          return room.usermobile.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
        });
        break;
      }
      case "progetto": {
        this.filteredRooms = this.rooms.filter((room) => {
          return room.nome_progetto.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
        });
        break;
      }
      // TODO : case "all" = filtro multiplo
      default: {
        this.filteredRooms = this.rooms;
        break;
      }
    }
  }

  /** Apre il popover per la selezione del filtro */
  openSelect(event: UIEvent, filterSelectRef: IonSelect){
    filterSelectRef.open(event);
  }

  /** Apre la pagina CREA ROOM */
  onNewRoomPage() {
    this.router.navigate(['/', 'room', 'new']);
  }

  /** Apre il modale di MODIFICA ROOM */
  onEditRoomModal() {
    this.modalController
      .create({
        component: EditRoomModalComponent,
      })
      .then(modalEl => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then(resultData => {
        console.log(resultData.data, resultData.role);
      });
  }

}
