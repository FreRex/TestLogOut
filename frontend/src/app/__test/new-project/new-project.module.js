"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewProjectPageModule = void 0;
const core_1 = require("@angular/core");
const common_1 = require("@angular/common");
const forms_1 = require("@angular/forms");
const angular_1 = require("@ionic/angular");
const new_project_routing_module_1 = require("./new-project-routing.module");
const new_project_page_1 = require("./new-project.page");
let NewProjectPageModule = class NewProjectPageModule {
};
NewProjectPageModule = __decorate([
    core_1.NgModule({
        imports: [
            common_1.CommonModule,
            forms_1.ReactiveFormsModule,
            angular_1.IonicModule,
            new_project_routing_module_1.NewProjectPageRoutingModule
        ],
        declarations: [new_project_page_1.NewProjectPage]
    })
], NewProjectPageModule);
exports.NewProjectPageModule = NewProjectPageModule;
