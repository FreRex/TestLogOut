import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { ProjectsService } from '../../projects/projects.service';

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.page.html',
  styleUrls: ['./new-project.page.scss'],
})
export class NewProjectPage implements OnInit {

  form: FormGroup;

  constructor(    
    private navController: NavController,
    private projectsService: ProjectsService
    ) { }

  ngOnInit() {
    this.form = new FormGroup({
      progetto: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(30)]
      }),
      usermobile: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(12)]
      }),
      collaudatore: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(30)]
      }),
      data: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      linkprogetto: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
    });
  }

  onCreateProject(){
    console.log("Progetto salvato");
    this.projectsService.saveProject(
      {
        progetto: this.form.value.get('progetto'),
        usermobile: this.form.value.get('usermobile'),
        linkprogetto: this.form.value.get('linkprogetto'),
        collaudatore: this.form.value.get('collaudatore'),
      }
      );
    this.navController.navigateBack(['/projects']);
  }
}
