"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@angular/core/testing");
const projects_service_1 = require("./projects.service");
describe('ProjectsService', () => {
    let service;
    beforeEach(() => {
        testing_1.TestBed.configureTestingModule({});
        service = testing_1.TestBed.inject(projects_service_1.ProjectsService);
    });
    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
