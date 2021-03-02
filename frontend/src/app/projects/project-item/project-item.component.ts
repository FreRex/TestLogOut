import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonItemSliding } from '@ionic/angular';
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