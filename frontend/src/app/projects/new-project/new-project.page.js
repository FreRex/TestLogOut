"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewProjectPage = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
let NewProjectPage = class NewProjectPage {
    constructor(navController, projectsService, authService) {
        this.navController = navController;
        this.projectsService = projectsService;
        this.authService = authService;
    }
    ngOnInit() {
        this.creator = this.authService.user;
        this.createForm();
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
            collaudatore: new forms_1.FormControl(this.creator ? this.creator : null, {
                updateOn: 'blur',
                validators: [forms_1.Validators.required, forms_1.Validators.maxLength(30)]
            }),
            linkprogetto: new forms_1.FormControl(null, {
                updateOn: 'blur',
                validators: [forms_1.Validators.required]
            }),
        });
    }
    onCreateProject() {
        this.projectsService.addProject(this.form.value.usermobile, this.form.value.progetto, this.form.value.collaudatore, this.form.value.linkprogetto);
        this.form.reset();
        console.log("Progetto creato");
        this.navController.navigateBack(['/projects']);
    }
};
NewProjectPage = __decorate([
    core_1.Component({
        selector: 'app-new-project',
        templateUrl: './new-project.page.html',
        styleUrls: ['./new-project.page.scss'],
    })
], NewProjectPage);
exports.NewProjectPage = NewProjectPage;
