import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Project } from '../project.model';
import { ProjectsPage } from '../projects.page';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss'],
})
export class CreateProjectComponent implements OnInit {

  project: Project;

  progetto: string; 
  usermobile: string; 
  linkprogetto: string; 
  collaudatore: string; 

  constructor(private modalController: ModalController) { }

  ngOnInit() { 
    if(this.project){
      this.progetto = this.project.progetto;
      this.usermobile = this.project.usermobile;
      this.linkprogetto = this.project.linkprogetto;
      this.collaudatore = this.project.collaudatore;
    }
  }

  onCancel() {
    this.modalController.dismiss(null, 'cancel');
  }

  onSave() {
    this.project = {
      usermobile: this.usermobile,
      progetto: this.progetto,
      linkprogetto: this.linkprogetto,
      collaudatore: this.collaudatore
    }
    console.log(this.project);

    this.modalController.dismiss({message: 'gg'}, 'save');
  }
}
