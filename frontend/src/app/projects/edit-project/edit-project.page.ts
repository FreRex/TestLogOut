import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { Project } from '../project.model';
import { ProjectsService } from '../projects.service';

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.page.html',
  styleUrls: ['./edit-project.page.scss'],
})
export class EditProjectPage implements OnInit {

  form: FormGroup;
  project: Project = { progetto: '', usermobile: '', linkprogetto: '', collaudatore: ''};
  projectId: string;
  isEditMode: boolean;

  constructor(
    private activatedRouter: ActivatedRoute,
    private navController: NavController,
    private projectsService: ProjectsService,
    private alertController: AlertController,
    private router: Router
  ) { }

  ngOnInit() {
    console.log(this.router.url);
    //FIXME: si rompe inserendo a mano l'indirizzo http://localhost:8100/projects/edit
    if(this.router.url.endsWith('new')){
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
        //TODO: this.createForm(); //dentro al subscribe?
      });
    }
    this.createForm();
  }

  createForm(){
    this.form = new FormGroup({
      progetto: new FormControl(this.project.progetto, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(30)]
      }),
      usermobile: new FormControl(this.project.usermobile, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(12)]
      }),
      collaudatore: new FormControl(this.project.collaudatore, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(30)]
      }),
      // data: new FormControl(null, {
      //   updateOn: 'blur',
      //   validators: [Validators.required]
      // }),
      linkprogetto: new FormControl(this.project.linkprogetto, {
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
    if(!this.form.valid){
      return;
    }
    
    this.project.progetto = this.form.value.progetto;
    this.project.usermobile = this.form.value.usermobile;
    this.project.linkprogetto = this.form.value.linkprogetto;
    this.project.collaudatore = this.form.value.collaudatore;

    if(this.isEditMode) {
      this.projectsService.saveProject(this.project);
      this.navController.navigateBack(['/projects']);
    } else {
      this.projectsService.createProject(this.project);
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
