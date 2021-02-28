"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const core_1 = require("@angular/core");
const angular_1 = require("@ionic/angular");
const service_worker_1 = require("@angular/service-worker");
const platform_browser_1 = require("@angular/platform-browser");
const http_1 = require("@angular/common/http");
const router_1 = require("@angular/router");
const storage_1 = require("@ionic/storage");
const app_component_1 = require("./app.component");
const app_routing_module_1 = require("./app-routing.module");
const environment_1 = require("../environments/environment");
const menu_component_1 = require("./shared/menu/menu.component");
let AppModule = class AppModule {
};
AppModule = __decorate([
    core_1.NgModule({
        declarations: [app_component_1.AppComponent, menu_component_1.MenuComponent],
        entryComponents: [],
        imports: [
            platform_browser_1.BrowserModule,
            app_routing_module_1.AppRoutingModule,
            http_1.HttpClientModule,
            angular_1.IonicModule.forRoot(),
            storage_1.IonicStorageModule.forRoot(),
            service_worker_1.ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment_1.environment.production }),
        ],
        providers: [{ provide: router_1.RouteReuseStrategy, useClass: angular_1.IonicRouteStrategy }],
        bootstrap: [app_component_1.AppComponent],
    })
], AppModule);
exports.AppModule = AppModule;
