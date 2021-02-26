import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { ProjectsService } from '../projects.service';

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.page.html',
  styleUrls: ['./new-project.page.scss'],
})
export class NewProjectPage implements OnInit {

  form: FormGroup;
  creator: string;

  constructor(
    private navController: NavController,
    private projectsService: ProjectsService,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.creator = this.authService.user;
    this.createForm();
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
      collaudatore: new FormControl(this.creator ? this.creator : null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(30)]
      }),
      linkprogetto: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
    });
  }

  onCreateProject() {
    this.projectsService.addProject(
      this.form.value.usermobile,
      this.form.value.progetto,
      this.form.value.collaudatore,
      this.form.value.linkprogetto);
    this.form.reset();
    console.log("Progetto creato");
    this.navController.navigateBack(['/projects']);
  }
}
