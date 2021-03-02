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
      nome_progetto: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(30)]
      }),
      usermobile: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(12)]
      }),
      nome_collaudatore: new FormControl(this.creator ? this.creator : null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(30)]
      }),
    });
  }

  onCreateProject() {
    this.projectsService.addProject(
      // ??? regole per creare un numero random per l'id
      Math.floor((Math.random() * 2000) + 1), // <-- Return a random number between 1 and 2000
      this.form.value.usermobile, 
      this.form.value.nome_progetto,
      this.form.value.nome_collaudatore);
    this.form.reset();
    console.log("Progetto creato");
    this.navController.navigateBack(['/projects']);
  }
}
