import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, IonInput, ModalController, PopoverController, ToastController } from '@ionic/angular';
import { BehaviorSubject, concat, Observable, of } from 'rxjs';
import { debounceTime, delay, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { Project, ProjectService } from 'src/app/backoffice/projects/project.service';
import { RoomService } from '../../room.service';

@Component({
  selector: 'new-room-form',
  templateUrl: './new-room-form.component.html',
  styleUrls: ['./new-room-form.component.scss'],
})
export class NewRoomFormComponent implements OnInit {

  //-------------------------------------------
  searchStream$ = new BehaviorSubject('');

  obs$: Observable<{ type: string; value?: Project[] }> = this.searchStream$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    switchMap((query) => 
      concat(
        of({ type: 'start'}),
        this.getByFilter(query).pipe(map(value => ({ type: 'finish', value })))
      ))
  );
  
  getByFilter(query: string) {
    // const products = PRODUCTS.filter(product => product.toLowerCase().includes(query.toLowerCase()))
    // return of(products).pipe(delay(500));
    return this.projectService.projects$.pipe(
      map((projects) =>
        projects.filter((project) =>
          project.nome.toLowerCase().includes(query.toLowerCase())
        )
      )
    )
  }
  //-------------------------------------------
  
  @ViewChild('searchInput', { static: true }) inputCollaudatore: IonInput;
  projects$: Observable<Project[]>;
  form: FormGroup;
  showList = true;
  project: Project;

  constructor(
    private modalController: ModalController,
    private roomsService: RoomService,
    private alertController: AlertController,
    private toastController: ToastController,
    private projectService: ProjectService
  ) { }


  ngOnInit() {
    this.onFilterProjects();

    this.form = new FormGroup({
      usermobile: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(12)]
      }),
      nome_progetto: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(30)]
      }),
      nome_collaudatore: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(30)]
      }),
    });

  }

  onFilterProjects() {
    this.projects$ = this.inputCollaudatore.ionInput.pipe(
      map((event) => (<HTMLInputElement>event.target).value),
      debounceTime(400),
      distinctUntilChanged(),
      startWith(""),
      switchMap((searchTerm) =>
        this.projectService.projects$.pipe(
          map((projects) =>
            projects.filter((project) =>
              project.nome.toLowerCase().includes(searchTerm.toLowerCase())
            )
          )
        )
      )
    );
  }

  onChooseProject(project: Project) {
    this.project = project;
    this.form.patchValue({ 
      nome_collaudatore: this.project.collaudatoreufficio,
      nome_progetto: this.project.nome, 
    });
  }

  // onFilter(eventValue: Event) {
  //   let searchTerm = (<HTMLInputElement>eventValue.target).value;
  //   this.projects = this.projects.filter((project) => {
  //     return project.collaudatoreufficio.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
  //   });
  // }

  onCreateRoom() {
    if (!this.form.valid) { return; }
    this.roomsService
      .addRoom(
        this.project.pk_proj.toString(),
        this.form.value.usermobile,
        this.form.value.nome_progetto,
        this.form.value.nome_collaudatore)
      .subscribe(
        res => {
          console.log("Response", res);
          this.presentToast('Room creata!');
          this.form.reset();
          this.modalController.dismiss({ message: 'room saved' }, 'save');
        },
        (err: HttpErrorResponse) => {
          console.log("Error:", err.error['text']);
          this.createErrorAlert(err.error['text']);
        }
      );
  }

  async createErrorAlert(error: string) {
    const alert = await this.alertController.create({
      header: "Errore:",
      message: error,
      buttons: [{ text: 'Annulla', role: 'cancel' },]
    });
    // FIX: si può fare in entrambi i modi, qual'è il più giusto?
    // .then(alertEl => { alertEl.present(); });
    alert.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      color: 'secondary',
      duration: 2000,
      buttons: [{ icon: 'close', role: 'cancel' }]
    })
    // FIX: si può fare in entrambi i modi, qual'è il più giusto?
    // .then(toastEl => toastEl.present());
    toast.present();
  }
}
