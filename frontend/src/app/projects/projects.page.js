"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectsPage = void 0;
const core_1 = require("@angular/core");
let ProjectsPage = class ProjectsPage {
    constructor(projectService, modalController, router, storage) {
        this.projectService = projectService;
        this.modalController = modalController;
        this.router = router;
        this.storage = storage;
        this.isSearchMode = false;
        this.filteredProjects = [];
        this.filter = 'progetto';
    }
    ngOnInit() {
        this.subscription = this.projectService.projectsChanged.subscribe((projects) => {
            this.projects = projects;
        });
    }
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
    ionViewWillEnter() {
        this.projects = this.projectService.getProjects();
    }
    onUpdateProjects() {
        this.projectService.fetchProjects()
            .subscribe(res => {
            this.projects = this.projectService.getProjects();
        });
    }
    onFilter(event) {
        let searchTerm = event.target.value;
        switch (this.filter) {
            case "collaudatore": {
                this.filteredProjects = this.projects.filter((project) => {
                    return project.collaudatore.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
                });
                break;
            }
            case "usermobile": {
                this.filteredProjects = this.projects.filter((project) => {
                    return project.usermobile.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
                });
                break;
            }
            case "progetto": {
                this.filteredProjects = this.projects.filter((project) => {
                    return project.progetto.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
                });
                break;
            }
            default: {
                this.filteredProjects = this.projects;
                break;
            }
        }
    }
    onNewProjectPage() {
        this.storage.set('edit', false);
        this.router.navigate(['/', 'projects', 'new']);
    }
};
ProjectsPage = __decorate([
    core_1.Component({
        selector: 'app-projects',
        templateUrl: './projects.page.html',
        styleUrls: ['./projects.page.scss'],
    })
], ProjectsPage);
exports.ProjectsPage = ProjectsPage;
