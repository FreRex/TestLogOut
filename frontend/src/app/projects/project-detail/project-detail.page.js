"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectDetailPage = void 0;
const core_1 = require("@angular/core");
let ProjectDetailPage = class ProjectDetailPage {
    constructor(activatedRouter, projectsService, alertController, navController, modalController) {
        this.activatedRouter = activatedRouter;
        this.projectsService = projectsService;
        this.alertController = alertController;
        this.navController = navController;
        this.modalController = modalController;
    }
    ngOnInit() {
        this.activatedRouter.paramMap.subscribe(paramMap => {
            if (!paramMap.has('projectId')) {
                this.navController.navigateBack(['/projects']);
                return;
            }
            const projectId = paramMap.get('projectId');
            this.loadedProject = this.projectsService.getProjectById(projectId);
        });
    }
    // onEditProject() {
    //   this.modalController
    //     .create({
    //       component: EditProjectModalComponent,
    //       componentProps: {
    //         projectId: this.loadedProject.usermobile,
    //         isEditMode: true
    //       }
    //     })
    //     .then(modalEl => { modalEl.present(); });
    // }
    onDeleteProject() {
        this.alertController.create({
            header: 'Sei sicuro?',
            message: 'Vuoi davvero cancellare il progetto?',
            buttons: [
                {
                    text: 'Annulla',
                    role: 'cancel'
                },
                {
                    text: 'Elimina',
                    handler: () => {
                        this.projectsService.deleteProject(this.loadedProject.usermobile);
                        this.navController.navigateBack(['/projects']);
                    }
                }
            ]
        }).then(alertEl => { alertEl.present(); });
    }
};
ProjectDetailPage = __decorate([
    core_1.Component({
        selector: 'app-project-detail',
        templateUrl: './project-detail.page.html',
        styleUrls: ['./project-detail.page.scss'],
    })
], ProjectDetailPage);
exports.ProjectDetailPage = ProjectDetailPage;
