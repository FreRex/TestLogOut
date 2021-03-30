import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { async, Observable, Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { User, UserService } from '../../users/user.service';
import { Project, ProjectService } from '../project.service';

@Component({
  selector: 'app-edit-project-modal',
  templateUrl: './edit-project-modal.component.html',
  styleUrls: ['./edit-project-modal.component.scss'],
})
export class EditProjectModalComponent implements OnInit {
  form: FormGroup;
  private sub: Subscription;
  users$: Observable <User[]>;

  @Input() projectId: number;
  project: Project;

  constructor(
    private userService: UserService,
    private modalCtrl: ModalController,
    private projectService: ProjectService,
    private toastController: ToastController
  ) {}

  ngOnInit() {

    this.users$ = this.userService.users$;

    this.projectService.getProject(this.projectId).subscribe((project) => {
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
        coordinate: new FormControl( `${this.project.long_centro_map}, ${this.project.lat_centro_map}`, {
          updateOn: 'blur',
          validators: [Validators.required, Validators.maxLength(50)],
        }),

/*         lat_centro_map: new FormControl(this.project.lat_centro_map, {
          updateOn: 'blur',
          validators: [Validators.required, Validators.maxLength(50)],
        }), */
/*         nodi_fisici: new FormControl(this.project.nodi_fisici, {
          updateOn: 'blur',
          validators: [Validators.required, Validators.maxLength(50)],
        }),
        nodi_ottici: new FormControl(this.project.nodi_ottici, {
          updateOn: 'blur',
          validators: [Validators.required, Validators.maxLength(50)],
        }),
        tratte: new FormControl(this.project.tratte, {
          updateOn: 'blur',
          validators: [Validators.required, Validators.maxLength(50)],
        }),
        conn_edif_opta: new FormControl(this.project.conn_edif_opta, {
          updateOn: 'blur',
          validators: [Validators.required, Validators.maxLength(50)],
        }), */
      });
    });
  }

  closeModal() {
    this.modalCtrl.dismiss(EditProjectModalComponent);
  }

  updateProject() {
    if (!this.form.valid) {
      return;
    }

    const coords = this.form.value.coordinate.split(",");

    this.projectService
      .updateProject(
        this.project.idprogetto,
        this.userService.getUserIdByName(this.form.value.collaudatoreufficio),
        this.form.value.pk_proj,
        this.form.value.nome,
        coords[0],
        coords[1],
      ).subscribe(res=>{
        this.presentToast("Progetto Aggiornato");
        this.form.reset();
        this.closeModal();
      })
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      color: 'secondary',
      duration: 2000,
      buttons: [ { icon: 'close', role: 'cancel'}]
    })
    toast.present();
  }
}
