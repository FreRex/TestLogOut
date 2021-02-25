"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditProjectPageModule = void 0;
const core_1 = require("@angular/core");
const common_1 = require("@angular/common");
const forms_1 = require("@angular/forms");
const angular_1 = require("@ionic/angular");
const edit_project_routing_module_1 = require("./edit-project-routing.module");
const edit_project_page_1 = require("./edit-project.page");
let EditProjectPageModule = class EditProjectPageModule {
};
EditProjectPageModule = __decorate([
    core_1.NgModule({
        imports: [
            common_1.CommonModule,
            forms_1.ReactiveFormsModule,
            angular_1.IonicModule,
            edit_project_routing_module_1.EditProjectPageRoutingModule
        ],
        declarations: [edit_project_page_1.EditProjectPage]
    })
], EditProjectPageModule);
exports.EditProjectPageModule = EditProjectPageModule;
