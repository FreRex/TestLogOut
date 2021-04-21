import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { User, UserService } from '../../user.service';
import { ProjectService } from '../../project.service';

@Component({
  selector: 'app-create-project-modal',
  templateUrl: './create-project-modal.component.html',
  styleUrls: ['./create-project-modal.component.scss'],
})
export class CreateProjectModalComponent implements OnInit {

  form: FormGroup;
  users$: Observable<User[]>;
  selectedUser: User;
  isListOpen: boolean = false;

  constructor(
    private modalController: ModalController,
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
        validators: [Validators.required, Validators.maxLength(20)]
      }),
      nome: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(50)]
      }),
      coordinate: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(100)],
      }),
      nodi_fisici: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(50)]
      }),
      nodi_ottici: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(50)]
      }),
      tratte: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(50)]
      }),
      conn_edif_opta: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(50)]
      }),
    });
  }

  onChooseUser(user: User) {
    this.isListOpen = false;
    this.selectedUser = user;
    this.form.patchValue({
      collaudatoreufficio: this.selectedUser.collaudatoreufficio,
    });
  }

  createProject() {
    if (!this.form.valid) { return; }
    const coords = this.form.value.coordinate.replace(' ', '').split(",");
    this.projectService
      .addProject(
        this.form.value.collaudatoreufficio,
        +this.form.value.pk_proj,
        this.form.value.nome,
        this.form.value.nodi_fisici,
        this.form.value.nodi_ottici,
        this.form.value.tratte,
        this.form.value.conn_edif_opta,
        coords[1].slice(0, 14),
        coords[0].slice(0, 14),
      ).subscribe(
        /** Il server risponde con 200 */
        res => {
          // non ci sono errori
          if (res['affectedRows'] === 1) {
            this.form.reset();
            this.modalController.dismiss({ message: 'Progetto Creato' }, 'ok');
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
