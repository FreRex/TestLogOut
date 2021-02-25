"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@angular/core/testing");
const angular_1 = require("@ionic/angular");
const edit_project_modal_component_1 = require("./edit-project-modal.component");
describe('CreateProjectComponent', () => {
    let component;
    let fixture;
    beforeEach(testing_1.waitForAsync(() => {
        testing_1.TestBed.configureTestingModule({
            declarations: [edit_project_modal_component_1.EditProjectModalComponent],
            imports: [angular_1.IonicModule.forRoot()]
        }).compileComponents();
        fixture = testing_1.TestBed.createComponent(edit_project_modal_component_1.EditProjectModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
