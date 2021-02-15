import { Component, Input, OnInit } from '@angular/core';
import { Project } from '../project.model';

@Component({
  selector: 'app-project-item',
  templateUrl: './project-item.component.html',
  styleUrls: ['./project-item.component.scss'],
})
export class ProjectItemComponent implements OnInit {

  @Input() project: Project;
  
  constructor() { }

  ngOnInit() {}

}