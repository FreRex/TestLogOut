import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { IonSearchbar, ModalController } from '@ionic/angular';
import { GisfoSyncModalComponent } from './gisfo-sync-modal/gisfo-sync-modal.component';
import { Proj } from './proj.model';
import { User } from './proj.service';
import { SIZE_TO_MEDIA } from '@ionic/core/dist/collection/utils/media'
import { StorageDataService } from '../shared/storage-data.service';
import { concat, fromEvent, Observable, of } from 'rxjs';
import { UploadShpModalComponent } from './upload-shp-modal/upload-shp-modal.component';
import { debounceTime, distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';



@Component({
  selector: 'app-backoffice',
  templateUrl: './backoffice.page.html',
  styleUrls: ['./backoffice.page.scss'],
})
export class BackofficePage implements OnInit, AfterViewInit {

  @ViewChild("searchInput", {static:true}) input: IonSearchbar;

  projects$:Observable<Proj[]>;
  filteredProjects$:Observable<Proj[]>;

  shpProjects:Proj[];
  users:User[];
  showProjects:boolean = true;



  constructor(
    private projService:StorageDataService,
    private modalCtrl: ModalController
    ) {}



    ngOnInit() {
      this.projects$ = this.projService.projects$;
    }

    ngAfterViewInit(): void {
      const obs = this.input.ionInput
      .pipe(
        map(
          event => (<HTMLInputElement>event.target).value
        ),
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(search => this.loadProjects(search))
      );
      const pino = this.loadProjects();
      this.projects$ = concat(pino, obs);
    }

    loadProjects(search: string =''): Observable<Proj[]>{
      return this.projects$.pipe(map(res => {
        console.log(res.filter(proj => proj.nome === search));
        return res.filter(proj => proj.nome === search)
      }));

    }

/*   search(eventValue: Event, view: boolean){
    this.projects = this.shpProjects;
    this.filteredUser = this.users;

    let searchTerm = (<HTMLInputElement>eventValue.target).value;
    if (view == this.showProjects){

      this.filteredProj = this.shpProjects.filter((Proj) => {
        return Proj.nome.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
      }
      );}
          else{

            this.filteredUser = this.users.filter((User) => {
              return User.collaudatoreufficio.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
            })
    }
  } */





  onDelete(){
    console.log("progetto eliminato");
  }


  openGisfoUpload() {
    this.modalCtrl
      .create({
        component: GisfoSyncModalComponent,
      })
      .then(modalEl => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then(resultData => {
        console.log(resultData.data, resultData.role);
      });
  }
  openUploadShp() {
    this.modalCtrl
      .create({
        component: UploadShpModalComponent
      })
      .then(modalEl => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then(resultData => {
        console.log(resultData.data, resultData.role);
      });
  }

  showProjectsClick(){
    this.showProjects = true;
  }
  showUsers(){
    this.showProjects = false;
  }

  toggleMenu() {
    const splitPane = document.querySelector('ion-split-pane')
    if (window.matchMedia(SIZE_TO_MEDIA[splitPane.when] || splitPane.when).matches) {
      splitPane.classList.toggle('split-pane-visible');
    }
  }
}
