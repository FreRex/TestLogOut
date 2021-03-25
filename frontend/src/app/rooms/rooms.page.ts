import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonSelect, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Room, RoomService } from './room.service';
import { NewRoomModalComponent } from './new-room-modal/new-room-modal.component';
import { AuthService } from '../auth/auth.service';
import { mergeMap, switchMap, tap } from 'rxjs/operators';

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
    private route: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.route.queryParams.pipe(
      switchMap(params => {
        console.log("user exist", !!params['user'], "is a number", !isNaN(params['user']), "is not 0", params['user'] !== '0');
        //if(x) = check if x is negative, undefined, null or empty 
        // isNaN(x) = determina se un valore è NaN o no
        if (params && params['user'] && !isNaN(params['user']) && params['user'] !== '0' && params['user'] !== '1') {
          this.authService.onLogin(+params['user']);
        } else {
          this.authService.onLogin(0);
        }
        return this.authService.authorizeAccess();
      }),
      switchMap(res => {
        return this.roomService.loadRooms();
      }),
    ).subscribe((rooms: Room[]) => {
      // mi sottoscrivo all'osservabile "get rooms()" che restituisce la lista di room
      // questa funzione viene eseguita qualsiasi volta la lista di room cambia
      this.isLoading = false;
      this.rooms = rooms;
      this.filteredRooms = this.rooms;
    });
  }

  ngOnDestroy() {
    // distruggo la subscription se viene distrutto il componente, per evitare memory leaks
    if (this.sub) { this.sub.unsubscribe(); }
  }

  doRefresh(event) {
    this.roomService.loadRooms().subscribe(res => { event.target.complete(); });
  }

  /** Funzione che filtra i progetti in base al fitro impostato e all'input */
  onFilter(eventValue: Event, filterValue?: string) {
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
