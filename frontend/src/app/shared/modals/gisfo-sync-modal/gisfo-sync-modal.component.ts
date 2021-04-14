import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { ProjectService } from '../../project.service';
import { User, UserService } from '../../user.service';

@Component({
  selector: 'app-gisfo-sync-modal',
  templateUrl: './gisfo-sync-modal.component.html',
  styleUrls: ['./gisfo-sync-modal.component.scss'],
})
export class GisfoSyncModalComponent implements OnInit {

  form: FormGroup;
  users$: Observable<User[]>;
  selectedUser: User;
  isListOpen: boolean = false;

  constructor(
    private modalController: ModalController,
    private userService: UserService,
    private projectService: ProjectService
  ) { }

  ngOnInit() {
    this.users$ = this.userService.users$;
    this.form = new FormGroup({
      collaudatoreufficio: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(50)]
      }),
      pk_proj: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(30)]
      }),
    });
  }

  syncProject() {
    if (!this.form.valid) { return; }
    this.modalController.dismiss({ message: 'begin sync' }, 'begin');

    this.projectService
      .syncProject(
        this.form.value.collaudatoreufficio,
        this.form.value.pk_proj
      ).subscribe(
        res => {
          console.log(res);
          /** Error: Uncaught (in promise): overlay does not exist */
          this.modalController.dismiss({ message: 'end sync' }, 'end');
        }
      );
  }

  onChooseUser(user: User) {
    this.isListOpen = false;
    this.selectedUser = user;
    this.form.patchValue({
      collaudatoreufficio: this.selectedUser.collaudatoreufficio,
    });
  }

  closeModal() {
    this.modalController.dismiss(null, 'cancel');
  }
}
