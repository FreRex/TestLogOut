"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthPage = void 0;
const core_1 = require("@angular/core");
let AuthPage = class AuthPage {
    constructor(authService, router) {
        this.authService = authService;
        this.router = router;
        this.isLogin = true;
    }
    ngOnInit() {
    }
    onSwitchMode() {
        this.isLogin = !this.isLogin;
    }
    // onLogin(){
    //   console.log(this.username);   
    //   this.authService.login(this.username);
    //   this.router.navigateByUrl('/projects'); 
    // }
    onSubmit(form) {
        if (!form.valid) {
            return;
        }
        const email = form.value.username;
        const password = form.value.password;
        console.log(email, password);
        if (this.isLogin) {
            //TODO: logica login
            this.authService.login(this.username);
            this.router.navigateByUrl('/projects');
        }
        else {
            //TODO: logica sign up
        }
    }
};
AuthPage = __decorate([
    core_1.Component({
        selector: 'app-auth',
        templateUrl: './auth.page.html',
        styleUrls: ['./auth.page.scss'],
    })
], AuthPage);
exports.AuthPage = AuthPage;
