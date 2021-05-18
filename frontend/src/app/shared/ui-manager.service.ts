import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class UiManagerService {
  constructor(private toastController: ToastController) {}

  syncToast;

  async createSyncToast() {
    this.syncToast = await this.toastController.create({
      message: 'Sincronizzazione in corso...',
      position: 'bottom',
      cssClass: 'sync-toast',
      color: 'secondary',
    });
    await this.syncToast.present();
  }

  async didsmissSyncToast() {
    this.syncToast.dismiss();
    const { role } = await this.syncToast.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }
}
