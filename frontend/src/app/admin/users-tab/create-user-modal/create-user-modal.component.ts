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

  constructor(
    private modalController: ModalController,
    private userService: UserService,
    private commissionService: CommissionService
  ) { }

  //-------------------------- DROPDOWN --------------------------//
  commissions$: Observable<Commission[]>;
  selectedCommission: Commission;
  isListOpen: boolean = false;

  onChooseCommission(commission: Commission) {
    this.isListOpen = false;
    this.selectedCommission = commission;
    this.form.patchValue({
      commessa: this.selectedCommission.commessa,
    });
  }
  //-------------------------- DROPDOWN --------------------------//

  ngOnInit() {
    this.commissions$ = this.commissionService.commissions$;

    this.form = new FormGroup({
      collaudatoreufficio: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(30)]
      }),
      commessa: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(30)]
      }),
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
        this.form.value.commessa,
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
