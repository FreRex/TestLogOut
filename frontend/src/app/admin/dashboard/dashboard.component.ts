import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { ProjectService } from 'src/app/shared/project.service';
import { User, UserService } from 'src/app/shared/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  form: FormGroup;
  users$: Observable<User[]>;
  selectedUser: User;
  isListOpen: boolean = false;
  coordinate: string = '';

  constructor(
    private toastController: ToastController,
    private alertController: AlertController,
    private http: HttpClient,
    private userService: UserService,
    private projectService: ProjectService
  ) { }

  ngOnInit() {
    this.users$ = this.userService.users$;
    this.form = new FormGroup({
      collaudatoreufficio: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(50)]
      }),
      pk_proj: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(30)]
      }),
    });
  }

  syncProject() {
    if (!this.form.valid) { return; }

    console.log('diomeda');

    this.toastController.create({
      message: 'Click to Close',
      position: 'top',
      buttons: [{
        text: 'Done',
        role: 'cancel',
        handler: () => { console.log('Cancel clicked'); }
      }]
    }).then(toastEl => {
      toastEl.present();
      return toastEl.onDidDismiss();
    }).then(res => {
      console.log('onDidDismiss resolved with role', res.role);
    });

    this.projectService
      .syncProject(
        this.form.value.collaudatoreufficio,
        this.form.value.pk_proj
      ).subscribe(
        res => console.log('end', res)
      );
  }

  onChooseUser(user: User) {
    this.isListOpen = false;
    this.selectedUser = user;
    this.form.patchValue({
      collaudatoreufficio: this.selectedUser.collaudatoreufficio,
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

  async presentToast(message: string, color?: string) {
    const toast = await this.toastController.create({
      message: message,
      color: color ? color : 'secondary',
      cssClass: 'custom-toast',
      duration: 2000
    })
  }

}
