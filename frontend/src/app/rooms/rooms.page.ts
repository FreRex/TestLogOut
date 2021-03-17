import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonSelect, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Room, RoomService } from './room.service';
import { EditRoomModalComponent } from './edit-room-modal/edit-room-modal.component';
import { SIZE_TO_MEDIA } from '@ionic/core/dist/collection/utils/media'
import { NewRoomModalComponent } from './new-room-modal/new-room-modal.component';

@Component({
  selector: 'app-room',
  templateUrl: './rooms.page.html',
  styleUrls: ['./rooms.page.scss'],
})
export class RoomsPage implements OnInit, OnDestroy {

  private sub: Subscription;
  rooms: Room[];
  // isSearchMode: boolean = false;
  filteredRooms: Room[] = [];
  isLoading = false;

  constructor(
    private modalController: ModalController,
    private roomService: RoomService,
    private router: Router,
  ) { }

  ngOnInit() {    
    
    this.isLoading = true;
    this.roomService.fetchRooms().subscribe(res => {
      this.isLoading = false;
    });

    // mi sottoscrivo all'osservabile "get rooms()" che restituisce la lista di room
    this.sub = this.roomService.rooms.subscribe(
      // questa funzione viene eseguita qualsiasi volta la lista di room cambia
      (rooms: Room[]) => {
        this.rooms = rooms;
        this.filteredRooms = this.rooms;
      }
    );
  }

  ngOnDestroy() {
    // distruggo la subscription se viene distrutto il componente, per evitare memory leaks
    if (this.sub) { this.sub.unsubscribe(); }
  }

  doRefresh(event) {
    this.roomService.fetchRooms().subscribe(res => { event.target.complete(); });
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
      default: {
        this.filteredRooms = this.rooms.filter((room) => {
          return (
            room.usermobile.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 ||
            room.nome_progetto.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 ||
            room.nome_collaudatore.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
          );
        }); break;
      }
    }
  }

  /** Apre il popover per la selezione del filtro */
  openSelect(event: UIEvent, filterSelectRef: IonSelect) {
    filterSelectRef.open(event);
  }

  /** Apre la pagina CREA ROOM */
  onNewRoomPage() {
    this.router.navigate(['/', 'room', 'new']);
  }

  /** Apre il modale di MODIFICA ROOM */
  onNewRoomModal() {
    this.modalController
      .create({
        component: NewRoomModalComponent,
        backdropDismiss: false,
        // cssClass: 'test-custom-modal-css',
      })
      .then(modalEl => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then(resultData => {
        console.log(resultData.data, resultData.role);
      });
  }
  // toggleMenu() {
  //   const splitPane = document.querySelector('ion-split-pane')
  //   if (window.matchMedia(SIZE_TO_MEDIA[splitPane.when] || splitPane.when).matches) {
  //     splitPane.classList.toggle('split-pane-visible');
  //   }
  // }

}
