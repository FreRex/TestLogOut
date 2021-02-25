"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectsListComponent = void 0;
const core_1 = require("@angular/core");
let ProjectsListComponent = class ProjectsListComponent {
    constructor(projectService) {
        this.projectService = projectService;
    }
    ngOnInit() {
        this.projectService.fetchProjects()
            .subscribe(res => {
            this.projects = this.projectService.getProjects();
            // this.projects = this.projectService.getProjectsFiltered("Desire Peci");
            console.log(this.projects);
        });
    }
};
ProjectsListComponent = __decorate([
    core_1.Component({
        template: ''
        // selector: 'app-projects-list',
        // templateUrl: './projects-list.component.html',
        // styleUrls: ['./projects-list.component.scss'],
    })
], ProjectsListComponent);
exports.ProjectsListComponent = ProjectsListComponent;
