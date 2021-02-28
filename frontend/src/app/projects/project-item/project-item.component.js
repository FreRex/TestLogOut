"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectItemComponent = void 0;
const core_1 = require("@angular/core");
let ProjectItemComponent = class ProjectItemComponent {
    constructor(
    // private modalController: ModalController,
    router) {
        this.router = router;
    }
    ngOnInit() { }
    onDownload() {
        // TODO: logica download foto
        console.log("Foto scaricate");
    }
    onOpenEditPage(slidingItem) {
        slidingItem.close();
        this.router.navigate(['/', 'projects', 'edit', this.projectItem.usermobile]);
    }
    onFavoutite() {
        console.log("My favourite project!");
        this.isFavourite = !this.isFavourite;
    }
};
__decorate([
    core_1.Input()
], ProjectItemComponent.prototype, "projectItem", void 0);
ProjectItemComponent = __decorate([
    core_1.Component({
        selector: 'app-project-item',
        templateUrl: './project-item.component.html',
        styleUrls: ['./project-item.component.scss'],
    })
], ProjectItemComponent);
exports.ProjectItemComponent = ProjectItemComponent;
