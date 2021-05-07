import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { forkJoin } from 'rxjs';
import { RoomService } from 'src/app/rooms/room.service';
import { DashboardService } from 'src/app/admin/dashboard/dashboard.service';
import { ProjectService } from 'src/app/admin/projects-tab/project.service';
import { User, UserService } from 'src/app/admin/users-tab/user.service';
import { environment } from 'src/environments/environment';

export interface Log {
  pk_proj: string;
  message: string;
  date: Date;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  selectedUser: User;
  form: FormGroup = this.fb.group({
    collaudatoreufficio: [null], // ---> La validazione viene fatta all'interno del dropdown
    pk_proj: [null, [Validators.required]],
  });

  coordinate: string = '';
  logs: Log[] = [];
  syncToast: HTMLIonToastElement;

  ngOnInit() { }

  syncProject() {
    if (!this.form.valid) { return; }

    // this.uiManager.createSyncToast();
    // this.projectService
    //   .syncProject(
    //     this.form.value.collaudatoreufficio,
    //     this.form.value.pk_proj
    //   ).subscribe(
    //     res => {
    //       this.uiManager.didsmissSyncToast();
    //       // TODO: ricaricare room e progetti alla fine della sincronizzazione
    //     }
    //   );

    this.toastController.create({
      message: 'Sincronizzazione in corso...',
      position: 'bottom',
      cssClass: 'sync-toast',
      color: 'secondary'
    }).then(toastEl => {
      toastEl.present();
      this.logs.push(
        {
          pk_proj: this.form.value.pk_proj,
          message: 'Sync started',
          date: new Date()
        }
      );
      this.dashService.sincroDb(
        this.form.value.collaudatoreufficio,
        this.form.value.pk_proj
      ).subscribe(res => {
        console.log('sincroended: ', res);
        toastEl.dismiss();
        this.logs.push(
          {
            pk_proj: this.form.value.pk_proj,
            message: 'Sync ended',
            date: new Date()
          }
        );
        this.reloadData();
      });
      return toastEl.onDidDismiss();
    });

  }

  reloadData() {
    this.loadingController
      .create({ keyboardClose: true, message: 'Loading...' })
      .then(loadingEl => {
        loadingEl.present();
        forkJoin({
          requestProjects: this.projectService.loadProjects(),
          requestRooms: this.roomService.loadRooms(),
        }).subscribe(({ requestProjects, requestRooms }) => {
          console.log(requestProjects);
          console.log(requestRooms);
          loadingEl.dismiss();
        });
      });
  }

  createLink(coordinate: string) {
    let coords = coordinate.replace(' ', '').split(',');
    window.open("https://www.nperf.com/it/map/IT/-/230.TIM/signal/?ll=" + coords[0] + "&lg=" + coords[1] + "&zoom=13");
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

  searchCoord(comune: string) {

    this.dashService.searchCity(comune).subscribe(
      res => {
        console.log(res);
        window.open("https://www.nperf.com/it/map/IT/-/230.TIM/signal/?ll=" + res[0]['latitude'] + "&lg=" + res[0]['longitude'] + "&zoom=13");
      }
    );

  }

  async presentToast(message: string, color?: string) {
    const toast = await this.toastController.create({
      message: message,
      color: color ? color : 'secondary',
      cssClass: 'custom-toast',
      duration: 2000
    });
    toast.present();
  }

  constructor(
    private toastController: ToastController,
    private alertController: AlertController,
    private http: HttpClient,
    public userService: UserService,
    private projectService: ProjectService,
    private dashService: DashboardService,
    private roomService: RoomService,
    private loadingController: LoadingController,
    private fb: FormBuilder,
  ) { }
}
