import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Commission, CommissionService } from '../../commission-tab/commission.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-create-user-modal',
  templateUrl: './create-user-modal.component.html',
  styleUrls: ['./create-user-modal.component.scss'],
})
export class CreateUserModalComponent implements OnInit {

  form: FormGroup;

  // ---> valore selezionato sul DROPDOWN 
  selectedCommission: Commission;

  constructor(
    private modalController: ModalController,
    private userService: UserService,
    public commissionService: CommissionService
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      collaudatoreufficio: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(30)]
      }),
      commessa: new FormControl(null),
      // ---> La validazione viene fatta all'interno del dropdown 
      username: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(50)]
      }),
      password: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(30)]
      }),
      autorizzazione: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(10)]
      }),
    });
  }

  createUser() {
    if (!this.form.valid) { return; }
    this.userService
      .addUser(
        this.form.value.collaudatoreufficio,
        this.form.value.username,
        this.form.value.password,
        this.form.value.autorizzazione,
        this.selectedCommission.id,
        this.selectedCommission.commessa,
      )
      .subscribe(
        /** Il server risponde con 200 */
        res => {
          // non ci sono errori
          if (res['affectedRows'] === 1) {
            this.form.reset();
            this.modalController.dismiss({ message: 'Utente Creato' }, 'ok');
          }
          // possibili errori
          else {
            this.form.reset();
            this.modalController.dismiss({ message: res['message'] }, 'error');
          }
        },
        /** Il server risponde con un errore */
        err => {
          this.form.reset();
          this.modalController.dismiss({ message: err.error['text'] }, 'error');
        }
      );
  }
  closeModal() {
    this.modalController.dismiss(null, 'cancel');
  }
}
