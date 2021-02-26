import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonItemSliding, ModalController } from '@ionic/angular';
// import { EditProjectModalComponent } from '../../angular_components/edit-project-modal/edit-project-modal.component';
import { Project } from '../project.model';

@Component({
  selector: 'app-project-item',
  templateUrl: './project-item.component.html',
  styleUrls: ['./project-item.component.scss'],
})
export class ProjectItemComponent implements OnInit {

  @Input() projectItem: Project;
  isFavourite: boolean;
  
  constructor(
    // private modalController: ModalController,
    private router: Router
    ) { }

  ngOnInit() {  }

  onDownload() {
    // TODO: logica download foto
    console.log("Foto scaricate");
  }

  onOpenEditPage(slidingItem: IonItemSliding){
    slidingItem.close();
    this.router.navigate(['/', 'projects', 'edit', this.projectItem.usermobile]);
  }

  onFavoutite(){
    console.log("My favourite project!");
    this.isFavourite = !this.isFavourite;
  }
}