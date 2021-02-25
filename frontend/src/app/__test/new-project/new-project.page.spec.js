"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@angular/core/testing");
const angular_1 = require("@ionic/angular");
const new_project_page_1 = require("./new-project.page");
describe('NewProjectPage', () => {
    let component;
    let fixture;
    beforeEach(testing_1.waitForAsync(() => {
        testing_1.TestBed.configureTestingModule({
            declarations: [new_project_page_1.NewProjectPage],
            imports: [angular_1.IonicModule.forRoot()]
        }).compileComponents();
        fixture = testing_1.TestBed.createComponent(new_project_page_1.NewProjectPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
