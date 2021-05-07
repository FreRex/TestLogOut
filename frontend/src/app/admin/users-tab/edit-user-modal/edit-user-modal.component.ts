import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IonSelect } from '@ionic/angular';
import { ModalController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Commission, CommissionService } from '../../commission-tab/commission.service';
import { User, UserService } from '../user.service';

@Component({
  selector: 'app-edit-user-modal',
  templateUrl: './edit-user-modal.component.html',
  styleUrls: ['./edit-user-modal.component.scss'],
})
export class EditUserModalComponent implements OnInit {

  form: FormGroup;
  dropdownValue: string;

  @Input() userId: number;
  user: User;

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

    this.userService.getUser(this.userId).subscribe((user) => {
      this.user = user;
      console.log(this.user.idutcas);
      this.dropdownValue = this.user.autorizzazione;

      this.form = new FormGroup({
        collaudatoreufficio: new FormControl(this.user.collaudatoreufficio, {
          updateOn: 'blur',
          validators: [Validators.required, Validators.maxLength(30)],
        }),
        commessa: new FormControl(this.user.commessa, {
          updateOn: 'blur',
          validators: [Validators.required, Validators.maxLength(30)]
        }),
        username: new FormControl(this.user.username, {
          updateOn: 'blur',
          validators: [Validators.required, Validators.maxLength(50)],
        }),
        password: new FormControl(this.user.password, {
          updateOn: 'blur',
          validators: [Validators.required, Validators.maxLength(30)],
        }),
        autorizzazione: new FormControl(this.user.idautorizzazione, {
          updateOn: 'blur',
          validators: [Validators.required, Validators.maxLength(30)],
        }),
      });
    });
  }

  updateUser() {
    if (!this.form.valid) { return }
    this.userService.updateUser(
      this.user.id,
      this.form.value.collaudatoreufficio,
      this.form.value.username,
      this.form.value.password,
      this.form.value.autorizzazione,
      this.user.idcommessa,
      this.form.value.commessa
    ).subscribe(
      /** Il server risponde con 200 */
      res => {
        // non ci sono errori
        if (res['affectedRows'] === 1) {
          this.form.reset();
          this.modalController.dismiss({ message: 'Utente Aggiornato' }, 'ok');
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
