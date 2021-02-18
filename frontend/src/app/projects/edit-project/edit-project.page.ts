import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { Project } from '../project.model';
import { ProjectsService } from '../projects.service';

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.page.html',
  styleUrls: ['./edit-project.page.scss'],
})
export class EditProjectPage implements OnInit {

  project: Project;

  constructor(
    private activatedRouter: ActivatedRoute,
    private navController: NavController,
    private projectsService: ProjectsService,
    private alertController: AlertController,
  ) { }

  ngOnInit() {
    this.activatedRouter.paramMap.subscribe(paramMap => {
      if (!paramMap.has('projectId')) {
        this.navController.navigateBack(['/projects']);
        return;
      }
      const projectId = paramMap.get('projectId');
      console.log(projectId);

      this.project = this.projectsService.getProjectById(projectId);
      console.log(this.project.usermobile);

    });
  }

  onDownload() {
    // TODO: logica download foto
    console.log("Foto scaricate");
  }

  onSave() {
    console.log("Progetto salvato");
    this.projectsService.saveProject(this.project);
    this.navController.navigateBack(['/projects']);
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
              this.navController.navigateBack(['/projects']);
            }
          }
        ]
      }
    ).then(alertEl => { alertEl.present(); });
  }
}
