import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Project, ProjectService } from 'src/app/shared/project.service';
import { RoomService } from '../../../rooms/room.service';

@Component({
  selector: 'app-new-room-modal',
  templateUrl: './new-room-modal.component.html',
  styleUrls: ['./new-room-modal.component.scss'],
})
export class NewRoomModalComponent implements OnInit {

  form: FormGroup;
  projects$: Observable<Project[]>;
  isListOpen: boolean = false;
  selectedProject: Project;

  constructor(
    private modalController: ModalController,
    private roomsService: RoomService,
    private projectService: ProjectService
  ) { }

  ngOnInit() {
    this.projects$ = this.projectService.projects$;
    this.form = new FormGroup({
      usermobile: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(30)]
      }),
      nome_progetto: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(50)]
      }),
      nome_collaudatore: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(50)]
      }),
    });
  }

  onChooseProject(project: Project) {
    this.isListOpen = false;
    this.selectedProject = project;
    this.form.patchValue({
      nome_collaudatore: this.selectedProject.collaudatoreufficio,
      nome_progetto: this.selectedProject.nome,
    });
  }

  createRoom() {
    if (!this.form.valid) { return; }
    this.roomsService
      .addRoom(
        this.selectedProject.pk_proj.toString(),
        this.form.value.usermobile,
        this.form.value.nome_progetto,
        this.form.value.nome_collaudatore)
      .subscribe(
        /** Il server risponde con 200 */
        res => {
          // non ci sono errori
          if (res['affectedRows'] === 1) {
            this.form.reset();
            this.modalController.dismiss({ message: 'Room Creata' }, 'ok');
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
