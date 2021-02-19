import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { Project } from '../../project.model';
import { ProjectsService } from '../../projects.service';

@Component({
  selector: 'app-edit-project-modal',
  templateUrl: './edit-project-modal.component.html',
  styleUrls: ['./edit-project-modal.component.scss'],
})
export class EditProjectModalComponent implements OnInit {

  project: Project = { progetto: '', usermobile: '', linkprogetto: '', collaudatore: '' };
  projectId: string;
  isEditMode: boolean;

  constructor(
    private modalController: ModalController,
    private projectsService: ProjectsService,
    private alertController: AlertController,
  ) { }

  ngOnInit() {
    this.project = this.projectsService.getProjectById(this.projectId);
  }

  onCancel() {
    this.modalController.dismiss(null, 'cancel');
  }

  onDownload() {
    // TODO: logica download foto
    console.log("Foto scaricate");
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    this.project.progetto = form.value.progetto;
    this.project.usermobile = form.value.usermobile;
    this.project.linkprogetto = form.value.linkprogetto;
    this.project.collaudatore = form.value.collaudatore;

    if (this.isEditMode) {
      this.projectsService.saveProject(this.project);
      this.modalController.dismiss({ message: 'project saved' }, 'save');
    } else {
      this.projectsService.createProject(this.project);
      this.modalController.dismiss({ message: 'project created' }, 'create');
    }
    console.log("Progetto salvato");
  }

  onDelete() {
    this.alertController.create(
      {
        header: 'Sei sicuro?',
        message: 'Vuoi davvero cancellare il progetto?',
        buttons: [
          {
            text: 'Annulla',
            role: 'cancel'
          },
          {
            text: 'Elimina',
            handler: () => {
              this.projectsService.deleteProject(this.project.usermobile);
              this.modalController.dismiss({ message: 'project deleted' }, 'delete');
            }
          }
        ]
      }
    ).then(alertEl => { alertEl.present(); });
  }
}
