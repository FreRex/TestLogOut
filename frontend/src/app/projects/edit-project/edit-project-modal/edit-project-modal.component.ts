import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Project } from '../../project.model';
import { ProjectsService } from '../../projects.service';

@Component({
  selector: 'app-edit-project-modal',
  templateUrl: './edit-project-modal.component.html',
  styleUrls: ['./edit-project-modal.component.scss'],
})
export class EditProjectModalComponent implements OnInit {
  
  project: Project = { usermobile: '', progetto: '', linkprogetto: '', collaudatore: ''};
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
              this.modalController.dismiss({message: 'project deleted'}, 'delete');
            }
          }
        ]
      }
    ).then(alertEl => { alertEl.present(); });
  }

  onDownload() {
    // TODO: logica download foto
    console.log("Foto scaricate");
  }

  onSave() {
    console.log("Progetto salvato");

    if(this.isEditMode) {
      this.projectsService.saveProject(this.project);
      this.modalController.dismiss({message: 'project saved'}, 'save');
    } else {
      // FIXME : quando creo un nuovo progetto senza usermobile non posso più editarlo
      this.projectsService.createProject(this.project);
      this.modalController.dismiss({message: 'project created'}, 'create');
    }
  }
}
