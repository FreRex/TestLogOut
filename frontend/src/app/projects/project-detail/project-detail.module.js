"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectDetailPageModule = void 0;
const core_1 = require("@angular/core");
const common_1 = require("@angular/common");
const forms_1 = require("@angular/forms");
const angular_1 = require("@ionic/angular");
const project_detail_routing_module_1 = require("./project-detail-routing.module");
const project_detail_page_1 = require("./project-detail.page");
let ProjectDetailPageModule = class ProjectDetailPageModule {
};
ProjectDetailPageModule = __decorate([
    core_1.NgModule({
        imports: [
            common_1.CommonModule,
            forms_1.FormsModule,
            angular_1.IonicModule,
            project_detail_routing_module_1.ProjectDetailPageRoutingModule
        ],
        declarations: [project_detail_page_1.ProjectDetailPage]
    })
], ProjectDetailPageModule);
exports.ProjectDetailPageModule = ProjectDetailPageModule;
