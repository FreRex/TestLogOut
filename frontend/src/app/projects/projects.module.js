"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectsPageModule = void 0;
const core_1 = require("@angular/core");
const common_1 = require("@angular/common");
const forms_1 = require("@angular/forms");
const angular_1 = require("@ionic/angular");
const projects_routing_module_1 = require("./projects-routing.module");
const projects_page_1 = require("./projects.page");
const project_item_component_1 = require("./project-item/project-item.component");
// import { EditProjectModalComponent } from '../angular_components/edit-project-modal/edit-project-modal.component';
let ProjectsPageModule = class ProjectsPageModule {
};
ProjectsPageModule = __decorate([
    core_1.NgModule({
        imports: [
            common_1.CommonModule,
            forms_1.FormsModule,
            angular_1.IonicModule,
            projects_routing_module_1.ProjectsPageRoutingModule
        ],
        declarations: [
            projects_page_1.ProjectsPage,
            project_item_component_1.ProjectItemComponent,
            // EditProjectModalComponent
        ],
        // entryComponents: [EditProjectModalComponent] // <-- Serve per i componenti che non sono dichiarati all'interno di altri template (es. modal)
    })
], ProjectsPageModule);
exports.ProjectsPageModule = ProjectsPageModule;
