import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  public alert: HTMLIonAlertElement = null;

  constructor(public alertController: AlertController) {}

  async presentAlert(header: string, message: string) {
    return new Promise(async (resolve) => {
      if (this.alert) {
        this.alert.dismiss();
        this.alert = null;
      }
      this.alert = await this.alertController.create({
        header: header,
        // subHeader: subHeader,
        message: message,
        buttons: [
          {
            text: 'OK',
            handler: (ok) => {
              resolve({ role: 'ok', message: 'Messaggio Ricevuto' });
              //   this.alert.dismiss({ message: 'Messaggio Ricevuto' }, 'ok');
            },
          },
        ],
        cssClass: 'custom-alert',
      });
      this.alert.present();
      // const { role } = await this.alert.onDidDismiss();
      // console.log('🐱‍👤 : role', role);
      // return role;
    });
  }
}
