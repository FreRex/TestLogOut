"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuComponent = void 0;
const core_1 = require("@angular/core");
let MenuComponent = class MenuComponent {
    constructor(authService, router) {
        this.authService = authService;
        this.router = router;
    }
    ngOnInit() {
        this.isLoggedIn = this.authService.userIsAthenticated;
    }
    onLogout() {
        this.authService.logout();
        this.router.navigateByUrl('/auth');
        this.isLoggedIn = this.authService.userIsAthenticated;
    }
    onLogin() {
        this.router.navigateByUrl('/auth');
    }
};
MenuComponent = __decorate([
    core_1.Component({
        selector: 'app-menu',
        templateUrl: './menu.component.html',
        styleUrls: ['./menu.component.scss'],
    })
], MenuComponent);
exports.MenuComponent = MenuComponent;
