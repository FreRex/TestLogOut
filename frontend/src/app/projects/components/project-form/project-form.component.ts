import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { Project } from '../../project.model';
import { Storage } from '@ionic/storage';
import { ProjectsService } from '../../projects.service';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.scss'],
})
export class ProjectFormComponent implements OnInit {

  form: FormGroup;
  project: Project = { progetto: '', usermobile: '', linkprogetto: '', collaudatore: '' };
  projectId: string;
  isEditMode: boolean;

  constructor(
    private activatedRouter: ActivatedRoute,
    private navController: NavController,
    private projectsService: ProjectsService,
    private authService: AuthService,
    private alertController: AlertController,
    private router: Router,
    private storage: Storage
  ) { }

  ngOnInit() {
    
    // this.createForm();
    // this.storage.get('edit').then(edit => {
    //   if(edit) {
    //     this.isEditMode = true;
    //     this.storage.get('usermobile').then(usermobile => {
    //       this.project = this.projectsService.getProjectById(usermobile);
    //       console.log(this.project);
    //       this.form.patchValue({
    //         progetto: this.project.progetto,
    //         usermobile: this.project.usermobile,
    //         collaudatore: this.project.collaudatore,
    //         linkprogetto: this.project.linkprogetto,
    //       });
    //     });
    //   } else {
    //     this.isEditMode = false;
    //   }
    // });

    this.createForm();
    console.log(this.router.url);
    // FIXME: si rompe inserendo a mano l'indirizzo http://localhost:8100/projects/edit
    if (this.router.url.endsWith('new')) {
      this.isEditMode = false;
    } else {
      this.isEditMode = true;
      this.activatedRouter.paramMap.subscribe(paramMap => {
        if (!paramMap.has('projectId')) {
          this.navController.navigateBack(['/projects']);
          return;
        }
        const projectId = paramMap.get('projectId');
        this.project = this.projectsService.getProjectById(projectId);
        this.form.patchValue({
          progetto: this.project.progetto,
          usermobile: this.project.usermobile,
          collaudatore: this.project.collaudatore,
          linkprogetto: this.project.linkprogetto,
        });
      });
    }

  }

  createForm() {
    this.form = new FormGroup({
      progetto: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(30)]
      }),
      usermobile: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(12)]
      }),
      collaudatore: new FormControl(this.authService.user, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(30)]
      }),
      linkprogetto: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
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

    if (this.isEditMode) {
      this.projectsService.saveProject(
        this.form.value.usermobile,
        this.form.value.progetto,
        this.form.value.collaudatore,
        this.form.value.linkprogetto);
      this.navController.navigateBack(['/projects']);
    } else {
      // this.projectsService.createProject(this.project);
      this.projectsService.addProject(
        this.form.value.usermobile,
        this.form.value.progetto,
        this.form.value.collaudatore,
        this.form.value.linkprogetto);
      this.form.reset();
      this.navController.navigateBack(['/projects']);
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
              this.navController.navigateBack(['/projects']);
            }
          }
        ]
      }
    ).then(alertEl => { alertEl.present(); });
  }

}
