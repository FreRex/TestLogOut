"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditProjectPage = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
let EditProjectPage = class EditProjectPage {
    constructor(activatedRouter, navController, projectsService, authService, alertController) {
        this.activatedRouter = activatedRouter;
        this.navController = navController;
        this.projectsService = projectsService;
        this.authService = authService;
        this.alertController = alertController;
        this.project = { progetto: '', usermobile: '', linkprogetto: '', collaudatore: '' };
    }
    ngOnInit() {
        this.createForm();
        // FIXME: si rompe inserendo a mano l'indirizzo http://localhost:8100/projects/edit
        this.activatedRouter.paramMap.subscribe(paramMap => {
            if (!paramMap.has('projectId')) {
                this.navController.navigateBack(['/projects']);
                return;
            }
            const projectId = paramMap.get('projectId');
            this.project = this.projectsService.getProjectById(projectId);
            this.form.patchValue({
                progetto: this.project.progetto,
                usermobile: this.project.usermobile,
                collaudatore: this.project.collaudatore,
                linkprogetto: this.project.linkprogetto,
            });
        });
    }
    createForm() {
        this.form = new forms_1.FormGroup({
            progetto: new forms_1.FormControl(null, {
                updateOn: 'blur',
                validators: [forms_1.Validators.required, forms_1.Validators.maxLength(30)]
            }),
            usermobile: new forms_1.FormControl(null, {
                updateOn: 'blur',
                validators: [forms_1.Validators.required, forms_1.Validators.maxLength(12)]
            }),
            collaudatore: new forms_1.FormControl(this.authService.user, {
                updateOn: 'blur',
                validators: [forms_1.Validators.required, forms_1.Validators.maxLength(30)]
            }),
            linkprogetto: new forms_1.FormControl(null, {
                updateOn: 'blur',
                validators: [forms_1.Validators.required]
            }),
        });
    }
    onCancel() {
        this.navController.navigateBack(['/projects']);
    }
    onDownload() {
        // TODO: logica download foto
        console.log("Foto scaricate");
    }
    onSave() {
        if (!this.form.valid) {
            return;
        }
        this.projectsService.saveProject(this.form.value.usermobile, this.form.value.progetto, this.form.value.collaudatore, this.form.value.linkprogetto);
        this.form.reset();
        console.log("Progetto salvato");
        this.navController.navigateBack(['/projects']);
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
                        this.navController.navigateBack(['/projects']);
                    }
                }
            ]
        }).then(alertEl => { alertEl.present(); });
    }
};
EditProjectPage = __decorate([
    core_1.Component({
        selector: 'app-edit-project',
        templateUrl: './edit-project.page.html',
        styleUrls: ['./edit-project.page.scss'],
    })
], EditProjectPage);
exports.EditProjectPage = EditProjectPage;
