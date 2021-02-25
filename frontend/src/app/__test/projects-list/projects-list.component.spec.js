"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@angular/core/testing");
const angular_1 = require("@ionic/angular");
const projects_list_component_1 = require("./projects-list.component");
describe('ProjectsListComponent', () => {
    let component;
    let fixture;
    beforeEach(testing_1.waitForAsync(() => {
        testing_1.TestBed.configureTestingModule({
            declarations: [projects_list_component_1.ProjectsListComponent],
            imports: [angular_1.IonicModule.forRoot()]
        }).compileComponents();
        fixture = testing_1.TestBed.createComponent(projects_list_component_1.ProjectsListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
