import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  // TODO: non si aggiorna quando faccio login, rendere this.authService.userIsAthenticated un osservabile
  isLoggedIn: boolean;

  constructor(
    private authService: AuthService,
    private alertController: AlertController,
    private toastController: ToastController,
    private router: Router,
    private http: HttpClient) { }

  ngOnInit() {
    // this.isLoggedIn = this.authService.userIsAuthenticated;
  }

  onLogout() {
    this.authService.logout();
    this.router.navigateByUrl('/auth');
    // this.isLoggedIn = this.authService.userIsAuthenticated;
  }

  onLogin() {
    this.router.navigateByUrl('/auth');
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

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      color: 'secondary',
      duration: 2000,
      buttons: [{ icon: 'close', role: 'cancel' }]
    })
    // FIX: si può fare in entrambi i modi, qual'è il più giusto?
    // .then(toastEl => toastEl.present());
    toast.present();
  }
}
