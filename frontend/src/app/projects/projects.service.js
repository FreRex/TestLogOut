"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectsService = void 0;
const core_1 = require("@angular/core");
const project_model_1 = require("./project.model");
const operators_1 = require("rxjs/operators");
const rxjs_1 = require("rxjs");
let ProjectsService = class ProjectsService {
    constructor(http, authService) {
        this.http = http;
        this.authService = authService;
        this._projects = [
            {
                usermobile: '1',
                progetto: 'Progetto 1',
                collaudatore: 'Collaudatore 1',
                linkprogetto: 'Link progetto 1',
            },
            {
                usermobile: '2',
                progetto: 'Progetto 2',
                collaudatore: 'Collaudatore 2',
                linkprogetto: 'Link progetto 2',
            },
            {
                usermobile: '3',
                progetto: 'Progetto 3',
                collaudatore: 'Collaudatore 3',
                linkprogetto: 'Link progetto 3',
            },
        ];
        this.projectsChanged = new rxjs_1.Subject();
    }
    getProjects() {
        return this._projects.slice(); // <-- slice() = crea una copia dell'array
        // return [...this.projects];        // <-- Spread Operator = ritorna i singoli valori dell'array = crea una copia dell'array
    }
    getProjectsFiltered(collaudatore) {
        return {
            ...this._projects.filter(proj => {
                return proj.collaudatore === collaudatore;
            })
        };
    }
    // TODO : sostituire proprietà id del progetto a usermobile
    getProjectById(id) {
        return {
            ...this._projects.find(proj => {
                return proj.usermobile === id; // <-- ritorna vero quando trova il progeto giusto
            })
        };
    }
    deleteProject(id) {
        this._projects = this._projects.filter(proj => {
            return proj.usermobile !== id; // <-- ritrorna vero per tutte le ricette tranne quella che voglio scartare
        });
        this.projectsChanged.next(this._projects.slice());
    }
    saveProject(usermobile, progetto, collaudatore, linkprogetto) {
        const id = this._projects.findIndex(proj => {
            return proj.usermobile === usermobile;
        });
        this._projects[id] = new project_model_1.Project(usermobile, progetto, collaudatore, linkprogetto);
        this.projectsChanged.next(this._projects.slice());
    }
    createProject(newProject) {
        this._projects.push(newProject);
        this.projectsChanged.next(this._projects.slice());
    }
    addProject(usermobile, progetto, collaudatore, linkprogetto) {
        const newProject = new project_model_1.Project(usermobile, progetto, collaudatore, linkprogetto);
        this._projects.push(newProject);
        this.projectsChanged.next(this._projects.slice());
    }
    /**
     * Aggiorna e sostituisce i progetti con quelli restituiti dal server
     */
    fetchProjects() {
        this._projects = [];
        return this.http
            .get('https://www.collaudolive.com:9083/apimultistreaming')
            .pipe(operators_1.map(resData => {
            for (const key in resData) {
                console.log(key);
                console.log(resData[key]);
                if (resData.hasOwnProperty(key)) {
                    this._projects.push({ ...resData[key], id: key });
                }
            }
        }));
    }
};
ProjectsService = __decorate([
    core_1.Injectable({
        providedIn: 'root'
    })
], ProjectsService);
exports.ProjectsService = ProjectsService;
