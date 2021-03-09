import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GisfoSyncModalComponent } from './gisfo-sync-modal/gisfo-sync-modal.component';
import { Proj } from './proj.model';
import { ProjService, User } from './proj.service';


@Component({
  selector: 'app-backoffice',
  templateUrl: './backoffice.page.html',
  styleUrls: ['./backoffice.page.scss'],
})
export class BackofficePage implements OnInit {

  shpProjects:Proj[];
  users:User[];
  showProjects:boolean = true;

  filteredProj:Proj[];
  filteredUser:User[];

  constructor(
    private projService: ProjService,
    private modalCtrl: ModalController
    ) {}

  ngOnInit() {

    this.projService.fetchProjects().subscribe(
      res => {
        this.reloadProj();
      }
    );
  }

  search(eventValue: Event, view: boolean){
    this.filteredProj = this.shpProjects;
    this.filteredUser = this.users;

    let searchTerm = (<HTMLInputElement>eventValue.target).value;
    if (view == this.showProjects){

      this.filteredProj = this.shpProjects.filter((Proj) => {
        return Proj.nome_progetto.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
      }
      );}
          else{

            this.filteredUser = this.users.filter((User) => {
              return User.collaudatoreufficio.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
            })
    }
  }



  onDelete(){
    console.log("progetto eliminato");
  }

  reloadProj(){
    this.shpProjects = this.projService.getProjects();
    this.filteredProj=this.shpProjects.slice();
  }

  openGisfoUpload() {
    this.modalCtrl
      .create({
        component: GisfoSyncModalComponent,
      })
      .then(modalEl => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then(resultData => {
        console.log(resultData.data, resultData.role);
      });
  }

  showProjectsClick(){
    this.showProjects = true;
  }
  showUsers(){
    this.showProjects = false;
    this.projService.fetchUsers().subscribe(
      users => {
        this.users = users;
        this.filteredUser = this.users.slice();
      }
    );
  }
}
