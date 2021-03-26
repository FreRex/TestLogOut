import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonSearchbar, ModalController, ToastController } from '@ionic/angular';
import { GisfoSyncModalComponent } from './projects/gisfo-sync-modal/gisfo-sync-modal.component';
import { CreateUserModalComponent } from './users/create-user-modal/create-user-modal.component';
import { UploadShpModalComponent } from './projects/upload-shp-modal/upload-shp-modal.component';
import { BehaviorSubject, concat, Observable, of } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
  switchMap,
  tap,
} from 'rxjs/operators';
import { Project, ProjectService } from './projects/project.service';
import { User, UserService } from './users/user.service';
import { EditProjectModalComponent } from './projects/edit-project-modal/edit-project-modal.component';
import { EditUserModalComponent } from './users/edit-user-modal/edit-user-modal.component';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-backoffice',
  templateUrl: './backoffice.page.html',
  styleUrls: ['./backoffice.page.scss'],
})
export class BackofficePage implements OnInit {
  @ViewChild('searchInput', { static: true }) input: IonSearchbar;

  projects: Project[];
  projects$: Observable<{ type: string; value?: Project[] }>;
  searchStream$ = new BehaviorSubject('');

  users: User[];
  users$: Observable<{ type: string; value?: User[] }>;
  showProjects: boolean = true;

  constructor(
    private projectService: ProjectService,
    private userService: UserService,
    private modalCtrl: ModalController,
    private toastController: ToastController,
    private alertController: AlertController,
    private authService: AuthService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.initFilterUsers();
    this.initFilterProjects();

    this.authService.getToken().pipe(
      switchMap(res => this.projectService.loadProjects()),
      switchMap(res => this.userService.loadUsers())
    ).subscribe();
  }

  /** Filtra Progetti in base alla ricerca */
  initFilterProjects() {
    this.projects$ = this.searchStream$.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      startWith(""),
      switchMap((query) =>
        concat(
          of({ type: 'start', value: null }),
          this.projectService.getProjectsByFilter(query)
            .pipe(map(projects => ({ type: 'finish', value: projects })))
        )
      ),
    );
  }

  /** Filtra Utenti in base alla ricerca */
  initFilterUsers() {
    this.users$ = this.searchStream$.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      startWith(""),
      switchMap((query) =>
      concat(
        of({ type: 'start', value: null }),
        this.userService.getUsersByFilter(query)
          .pipe(map(users => ({ type: 'finish', value: users })))
      )
    ),
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

  openEditProject(projectId: number) {
    this.modalCtrl
      .create({
        component: EditProjectModalComponent,
        componentProps: { projectId: projectId }
      })
      .then((modalEl) => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
  }

  openEditUser(userId: number) {
    this.modalCtrl
      .create({
        component: EditUserModalComponent,
        componentProps: { userId: userId }
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
                this.presentToast('Utente Eliminato');
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
              this.projectService.deleteProject(projectId).subscribe(res => {
                this.presentToast('Progetto Eliminato');
              });
            }
          }
        ]
      }
    ).then(alertEl => { alertEl.present(); });
  }

  onRiavviaStreaming() {
    this.alertController.create(
      {
        header: 'Riavvio Server Streaming',
        message: 'Vuoi davvero riavviare server streaming?',
        buttons: [
          {
            text: 'Annulla',
            role: 'cancel'
          },
          {
            text: 'Riavvia',
            handler: () => {
              this.http.get(`${environment.apiUrl}/vidapp/`).subscribe(
                res => {
                  const restarted: boolean = res['restartNMS'];
                  if (restarted) {
                    this.presentToast('Server Streaming Riavviato');
                  }
                }
              );
            }
          }
        ]
      }
    ).then(alertEl => { alertEl.present(); });
  }
}
