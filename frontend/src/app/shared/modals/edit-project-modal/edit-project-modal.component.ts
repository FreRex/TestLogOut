import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { async, BehaviorSubject, concat, Observable, of, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap, take } from 'rxjs/operators';
import { User, UserService } from '../../user.service';
import { Project, ProjectService } from '../../project.service';

@Component({
  selector: 'app-edit-project-modal',
  templateUrl: './edit-project-modal.component.html',
  styleUrls: ['./edit-project-modal.component.scss'],
})
export class EditProjectModalComponent implements OnInit {

  form: FormGroup;
  users$: Observable<User[]>;
  selectedUser: User;
  isListOpen: boolean = false;
  @Input() projectId: number;
  project: Project;

  constructor(
    private userService: UserService,
    private modalCtrl: ModalController,
    private projectService: ProjectService,
  ) { }

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
        coordinate: new FormControl(`${this.project.lat_centro_map} , ${this.project.long_centro_map}`, {
          updateOn: 'blur',
          validators: [Validators.required, Validators.maxLength(100)],
        }),
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
        this.form.value.collaudatoreufficio,
        this.project.pk_proj,
        this.form.value.nome,
        coords[1],
        coords[0],
      ).subscribe(res => {
        this.form.reset();
        this.closeModal();
      });
  }
  onChooseUser(user: User) {
    this.isListOpen = false;
    this.selectedUser = user;
    this.form.patchValue({
      collaudatoreufficio: this.selectedUser.collaudatoreufficio,
    });
  }
}
