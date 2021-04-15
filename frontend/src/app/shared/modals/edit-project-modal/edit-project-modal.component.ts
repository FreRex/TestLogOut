import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { User, UserService } from '../../user.service';
import { Project, ProjectService } from '../../project.service';

@Component({
  selector: 'app-edit-project-modal',
  templateUrl: './edit-project-modal.component.html',
  styleUrls: ['./edit-project-modal.component.scss'],
})
export class EditProjectModalComponent implements OnInit {

  form: FormGroup;
  @Input() projectId: number;
  project: Project;

  users$: Observable<User[]>;
  selectedUser: User;
  isListOpen: boolean = false;

  constructor(
    private userService: UserService,
    private modalController: ModalController,
    private projectService: ProjectService,
    public toastController: ToastController
  ) { }

  ngOnInit() {
    this.users$ = this.userService.users$;
    this.projectService.getProject(this.projectId).subscribe(project => {
      this.project = project;
      this.form = new FormGroup({
        collaudatoreufficio: new FormControl(this.project.collaudatoreufficio, {
          updateOn: 'blur',
          validators: [Validators.required, Validators.maxLength(50)],
        }),
        nome: new FormControl(this.project.nome, {
          updateOn: 'blur',
          validators: [Validators.required, Validators.maxLength(50)],
        }),
        coordinate: new FormControl(`${this.project.lat_centro_map}, ${this.project.long_centro_map}`, {
          updateOn: 'blur',
          validators: [Validators.required, Validators.maxLength(100)],
        }),
      });
    });
  }

  onChooseUser(user: User) {
    this.isListOpen = false;
    this.selectedUser = user;
    this.form.patchValue({
      collaudatoreufficio: this.selectedUser.collaudatoreufficio,
    });
  }

  updateProject() {
    if (!this.form.valid) { return; }
    const coords = this.form.value.coordinate.replace(' ', '').split(",");
    this.projectService
      .updateProject(
        this.project.idprogetto,
        this.form.value.collaudatoreufficio,
        this.project.pk_proj,
        this.form.value.nome,
        coords[1].slice(0, 14),
        coords[0].slice(0, 14),
      ).subscribe(
        /** Il server risponde con 200 */
        res => {
          // non ci sono errori
          if (res['affectedRows'] === 1) {
            this.form.reset();
            this.modalController.dismiss({ message: 'Progetto Aggiornato' }, 'ok');
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
