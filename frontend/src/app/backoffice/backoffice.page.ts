import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { IonSearchbar, ModalController } from '@ionic/angular';
import { GisfoSyncModalComponent } from './gisfo-sync-modal/gisfo-sync-modal.component';
import { CreateUserModalComponent } from './create-user-modal/create-user-modal.component';
import { UploadShpModalComponent } from './upload-shp-modal/upload-shp-modal.component';
import { Project, User, StorageDataService } from '../shared/storage-data.service';
import { SIZE_TO_MEDIA } from '@ionic/core/dist/collection/utils/media';
import { Observable } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
  switchMap,
} from 'rxjs/operators';

@Component({
  selector: 'app-backoffice',
  templateUrl: './backoffice.page.html',
  styleUrls: ['./backoffice.page.scss'],
})
export class BackofficePage implements AfterViewInit {
  @ViewChild('searchInput', { static: true }) input: IonSearchbar;

  projects$: Observable<Project[]>;
  users$: Observable<User[]>;
  showProjects: boolean = true;


  constructor(
    private projService: StorageDataService,
    private userService: StorageDataService,
    private modalCtrl: ModalController
  ) {}

  ngAfterViewInit(): void {
    this.filterProjects();
    this.filterUsers();
  }

  filterProjects(): void {
    this.projects$ = this.input.ionInput.pipe(
      map((event) => (<HTMLInputElement>event.target).value),
      debounceTime(400),
      distinctUntilChanged(),
      startWith(""),
      switchMap((search) =>
        this.projService.projects$.pipe(
          map((projects) =>
            projects.filter((proj) =>
              proj.nome.toLowerCase().includes(search.toLowerCase())
            )
          )
        )
      )
    );
  }

  filterUsers(){
    this.users$ = this.input.ionInput.pipe(
      map((event) => (<HTMLInputElement>event.target).value),
      debounceTime(400),
      distinctUntilChanged(),
      startWith(""),
      switchMap((search) =>
        this.userService.users$.pipe(
          map((users) =>
            users.filter((user) =>
              user.collaudatoreufficio.toLowerCase().includes(search.toLowerCase())
            )
          )
        )
      )
    );
  }

  onDelete() {
    console.log('progetto eliminato');
  }

  /* *********************** MODALS *********************** */

  openGisfoUpload() {
    this.modalCtrl
      .create({
        component: GisfoSyncModalComponent,
      })
      .then((modalEl) => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then((resultData) => {
        console.log(resultData.data, resultData.role);
      });
  }

  openUploadShp() {
    this.modalCtrl
      .create({
        component: UploadShpModalComponent,
      })
      .then((modalEl) => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then((resultData) => {
        console.log(resultData.data, resultData.role);
      });
  }

  openCreateUser() {
    this.modalCtrl
      .create({
        component: CreateUserModalComponent,
      })
      .then((modalEl) => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then((resultData) => {
        console.log(resultData.data, resultData.role);
      });
  }
  /* *************************END MODALS*********************************** */
  showProjectsClick() {
    this.showProjects = true;
  }
  showUsers() {
    this.showProjects = false;
  }

  toggleMenu() {
    const splitPane = document.querySelector('ion-split-pane');
    if (
      window.matchMedia(SIZE_TO_MEDIA[splitPane.when] || splitPane.when).matches
    ) {
      splitPane.classList.toggle('split-pane-visible');
    }
  }
}
