import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { User, UserService } from '../../user.service';
import { ProjectService } from '../../project.service';

@Component({
  selector: 'app-upload-shp-modal',
  templateUrl: './upload-shp-modal.component.html',
  styleUrls: ['./upload-shp-modal.component.scss'],
})
export class UploadShpModalComponent implements OnInit {

  form: FormGroup;
  users$: Observable<User[]>;
  selectedUser: User;
  isListOpen: boolean = false;

  constructor(
    private modalCtrl: ModalController,
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
    const coords = this.form.value.coordinate.split(",");
    this.projectService
      .addProject(
        this.form.value.collaudatoreufficio,
        this.form.value.pk_proj,
        this.form.value.nome,
        this.form.value.nodi_fisici,
        this.form.value.nodi_ottici,
        this.form.value.tratte,
        this.form.value.conn_edif_opta,
        coords[1].slice(0, 14),
        coords[0].slice(0, 14),
      ).subscribe(
        res => {
          this.form.reset();
          this.modalCtrl.dismiss({ message: 'project created' }, 'ok');
        },
      );
  }

  closeModal() {
    this.modalCtrl.dismiss(UploadShpModalComponent);
  }
}
