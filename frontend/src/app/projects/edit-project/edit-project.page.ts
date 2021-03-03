import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { Project } from '../project.model';
import { ProjectsService } from '../projects.service';

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.page.html',
  styleUrls: ['./edit-project.page.scss'],
})
export class EditProjectPage implements OnInit {

  form: FormGroup;
  project: Project;
  projectId: string;

  constructor(
    private activatedRouter: ActivatedRoute,
    private navController: NavController,
    private projectsService: ProjectsService,
    private authService: AuthService,
    private alertController: AlertController,
  ) { }

  ngOnInit() {
    this.createForm();

    // FIXME: si rompe inserendo a mano l'indirizzo http://localhost:8100/projects/edit
    this.activatedRouter.paramMap.subscribe(paramMap => {
      if (!paramMap.has('projectId')) {
        this.navController.navigateBack(['/projects']);
        return;
      }
      const projectId = paramMap.get('projectId');
      this.project = this.projectsService.getProjectById(projectId);

      this.form.patchValue({
        usermobile: this.project.usermobile,
        nome_progetto: this.project.nome_progetto,
        nome_collaudatore: this.project.nome_collaudatore,
        // data_inserimento: new Date(this.project.data_inserimento).toISOString(),
      });
    });
  }

  createForm() {
    this.form = new FormGroup({
      usermobile: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(12)]
      }),
      nome_progetto: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(30)]
      }),
      nome_collaudatore: new FormControl(this.authService.user, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(30)]
      }),
      // data_inserimento: new FormControl(null, {
      //   updateOn: 'blur',
      //   validators: [Validators.required]
      // }),
    });
  }

  onCancel() {
    this.navController.navigateBack(['/projects']);
  }

  onDownload() {
    // TODO: logica download foto
    console.log("Foto scaricate");
  }

  onSave() {
    if (!this.form.valid) {
      return;
    }
    this.projectsService.saveProject(
      this.project.id,
      this.form.value.usermobile,
      this.form.value.nome_progetto,
      this.form.value.nome_collaudatore);
    this.form.reset();
    console.log("Progetto salvato");
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
