"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditProjectModalComponent = void 0;
const core_1 = require("@angular/core");
let EditProjectModalComponent = class EditProjectModalComponent {
    constructor(modalController, projectsService, alertController) {
        this.modalController = modalController;
        this.projectsService = projectsService;
        this.alertController = alertController;
        this.project = { progetto: '', usermobile: '', linkprogetto: '', collaudatore: '' };
    }
    ngOnInit() {
        this.project = this.projectsService.getProjectById(this.projectId);
    }
    onCancel() {
        this.modalController.dismiss(null, 'cancel');
    }
    onDownload() {
        // TODO: logica download foto
        console.log("Foto scaricate");
    }
    onSubmit(form) {
        if (!form.valid) {
            return;
        }
        this.project.progetto = form.value.progetto;
        this.project.usermobile = form.value.usermobile;
        this.project.linkprogetto = form.value.linkprogetto;
        this.project.collaudatore = form.value.collaudatore;
        if (this.isEditMode) {
            this.projectsService.saveProject(this.project);
            this.modalController.dismiss({ message: 'project saved' }, 'save');
        }
        else {
            this.projectsService.createProject(this.project);
            this.modalController.dismiss({ message: 'project created' }, 'create');
        }
        console.log("Progetto salvato");
    }
    onDelete() {
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
                        this.projectsService.deleteProject(this.project.usermobile);
                        this.modalController.dismiss({ message: 'project deleted' }, 'delete');
                    }
                }
            ]
        }).then(alertEl => { alertEl.present(); });
    }
};
EditProjectModalComponent = __decorate([
    core_1.Component({
        template: ''
        // selector: 'app-edit-project-modal',
        // templateUrl: './edit-project-modal.component.html',
        // styleUrls: ['./edit-project-modal.component.scss'],
    })
], EditProjectModalComponent);
exports.EditProjectModalComponent = EditProjectModalComponent;
