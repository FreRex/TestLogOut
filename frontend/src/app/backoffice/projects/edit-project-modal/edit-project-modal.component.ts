import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { async, BehaviorSubject, concat, Observable, of, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap, take } from 'rxjs/operators';
import { User, UserService } from '../../users/user.service';
import { Project, ProjectService } from '../project.service';

@Component({
  selector: 'app-edit-project-modal',
  templateUrl: './edit-project-modal.component.html',
  styleUrls: ['./edit-project-modal.component.scss'],
})
export class EditProjectModalComponent implements OnInit {
  form: FormGroup;
  
  searchStream$ = new BehaviorSubject('');
  users$: Observable <User[]>;

  @Input() projectId: number;
  project: Project;
  // user:User;

  constructor(
    private userService: UserService,
    private modalCtrl: ModalController,
    private projectService: ProjectService,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.initFilterUsers();
    this.projectService.getProject(this.projectId).subscribe((project) => {
      this.project = project;
      this.form = new FormGroup({
        collaudatoreufficio: new FormControl(this.project.collaudatoreufficio, {
          updateOn: 'blur',
          validators: [Validators.required, Validators.maxLength(50)],
        }),
        nome: new FormControl(this.project.nome, {
          updateOn: 'blur',
          validators: [Validators.required, Validators.maxLength(50)],
        }),
        coordinate: new FormControl( `${this.project.lat_centro_map} , ${this.project.long_centro_map}`, {
          updateOn: 'blur',
          validators: [Validators.required, Validators.maxLength(100)],
        }),
      });
    });
  }

  /** Filtra Utenti in base alla ricerca */
  initFilterUsers() {
    this.users$ = this.searchStream$.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      // startWith(""),
      switchMap((query) => this.userService.getUsersByFilter(query)));
  }
  
  closeModal() {
    this.modalCtrl.dismiss(EditProjectModalComponent);
  }

  updateProject() {
    if (!this.form.valid) {
      return;
    }
    const coords = this.form.value.coordinate.split(",");
    this.projectService
      .updateProject(
        this.project.idprogetto,
        this.form.value.collaudatoreufficio,
        this.project.pk_proj,
        this.form.value.nome,
        coords[1],
        coords[0],
      ).subscribe(res=>{
        this.presentToast("Progetto Aggiornato");
        this.form.reset();
        this.closeModal();
      })
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      color: 'secondary',
      duration: 2000,
      buttons: [{ icon: 'close', role: 'cancel' }]
    })
    toast.present();
  }

  /* MENU A TENDINA  per utenti*/
  isListOpen: boolean = false;
  projListOpen() {
    document.getElementById("myDropdown").classList.add("show");
    // console.log(this.isListOpen);
    this.isListOpen = true;
  }
  onChooseUser(user: User) {
    this.projListClose();
    // this.user = user;
    this.form.patchValue({
      collaudatoreufficio: user.collaudatoreufficio
    });
  }
  projListClose() {
    document.getElementById("myDropdown").classList.remove("show");
    // console.log(this.isListOpen);
    this.isListOpen = false;
  }
  toggleDropdown() {
    if(this.isListOpen) this.projListClose();
    else this.projListOpen();
  }
}
