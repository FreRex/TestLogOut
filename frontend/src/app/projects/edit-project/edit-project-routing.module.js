"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditProjectPageRoutingModule = void 0;
const core_1 = require("@angular/core");
const router_1 = require("@angular/router");
const edit_project_page_1 = require("./edit-project.page");
const routes = [
    {
        path: '',
        component: edit_project_page_1.EditProjectPage
    }
];
let EditProjectPageRoutingModule = class EditProjectPageRoutingModule {
};
EditProjectPageRoutingModule = __decorate([
    core_1.NgModule({
        imports: [router_1.RouterModule.forChild(routes)],
        exports: [router_1.RouterModule],
    })
], EditProjectPageRoutingModule);
exports.EditProjectPageRoutingModule = EditProjectPageRoutingModule;
