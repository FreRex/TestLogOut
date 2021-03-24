import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonSearchbar, ModalController, ToastController } from '@ionic/angular';
import { GisfoSyncModalComponent } from './projects/gisfo-sync-modal/gisfo-sync-modal.component';
import { CreateUserModalComponent } from './users/create-user-modal/create-user-modal.component';
import { UploadShpModalComponent } from './projects/upload-shp-modal/upload-shp-modal.component';
import { Observable } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
  switchMap,
} from 'rxjs/operators';
import { Project, ProjectService } from './projects/project.service';
import { User, UserService } from './users/user.service';
import { EditProjectModalComponent } from './projects/edit-project-modal/edit-project-modal.component';
import { EditUserModalComponent } from './users/edit-user-modal/edit-user-modal.component';

@Component({
  selector: 'app-backoffice',
  templateUrl: './backoffice.page.html',
  styleUrls: ['./backoffice.page.scss'],
})
export class BackofficePage implements OnInit {
  @ViewChild('searchInput', { static: true }) input: IonSearchbar;

  projects$: Observable<Project[]>;
  users$: Observable<User[]>;
  showProjects: boolean = true;

  constructor(
    private projService: ProjectService,
    private userService: UserService,
    private modalCtrl: ModalController,
    private toastController: ToastController,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.filterProjects();
    this.filterUsers();
  }

  /** Filtra Progetti in base alla ricerca */
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
              proj.nome.toLowerCase().includes(search.toLowerCase()) ||
              proj.collaudatoreufficio.toLowerCase().includes(search.toLowerCase()) ||
              proj.pk_proj.toString().toLowerCase().includes(search.toLowerCase())
            )
          )
        )
      )
    );
  }

  /** Filtra Utenti in base alla ricerca */
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
              user.collaudatoreufficio.toLowerCase().includes(search.toLowerCase()) ||
              user.id.toString().toLowerCase().includes(search.toLowerCase())
            )
          )
        )
      )
    );
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
  }

  openEditProject(projectId:number) {
    this.modalCtrl
      .create({
        component: EditProjectModalComponent,
        componentProps: {projectId:projectId}
      })
      .then((modalEl) => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
  }

  openEditUser(userId:number) {
    this.modalCtrl
      .create({
        component: EditUserModalComponent,
        componentProps: {userId:userId}
      })
      .then((modalEl) => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
  }
  /* *************************END MODALS*********************************** */
  showProjectsClick() {
    this.showProjects = true;
  }
  showUsers() {
    this.showProjects = false;
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      color: 'secondary',
      duration: 2000
    })
    // FIX: si può fare in entrambi i modi, qual'è il più giusto?
    // .then(toastEl => toastEl.present());
    toast.present();
  }

  onDeleteUser(userId: number) {
    this.alertController.create(
      {
        header: 'Sei sicuro?',
        message: "Vuoi davvero cancellare l'Utente?",
        buttons: [
          {
            text: 'Annulla',
            role: 'cancel'
          },
          {
            text: 'Elimina',
            handler: () => {
              this.userService.deleteUser(userId).subscribe(res => {
                this.presentToast('User Eliminato');
              });
            }
          }
        ]
      }
    ).then(alertEl => { alertEl.present(); });
  }

  onDeleteProject(projectId: number) {
    this.alertController.create(
      {
        header: 'Sei sicuro?',
        message: "Vuoi davvero cancellare il progetto?",
        buttons: [
          {
            text: 'Annulla',
            role: 'cancel'
          },
          {
            text: 'Elimina',
            handler: () => {
              this.projService.deleteProject(projectId).subscribe(res => {
                this.presentToast('Progetto Eliminato');
              });
            }
          }
        ]
      }
    ).then(alertEl => { alertEl.present(); });
  }

}
