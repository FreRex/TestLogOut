"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@angular/core/testing");
const angular_1 = require("@ionic/angular");
const menu_component_1 = require("./menu.component");
describe('MenuComponent', () => {
    let component;
    let fixture;
    beforeEach(testing_1.waitForAsync(() => {
        testing_1.TestBed.configureTestingModule({
            declarations: [menu_component_1.MenuComponent],
            imports: [angular_1.IonicModule.forRoot()]
        }).compileComponents();
        fixture = testing_1.TestBed.createComponent(menu_component_1.MenuComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
