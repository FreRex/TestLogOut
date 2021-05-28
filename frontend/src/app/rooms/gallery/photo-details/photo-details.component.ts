import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Foto } from '../media.service';

@Component({
  selector: 'app-photo-details',
  templateUrl: './photo-details.component.html',
  styleUrls: ['./photo-details.component.scss'],
})
export class PhotoDetailsComponent implements OnInit{

  
  @Input() foto: Foto;

  constructor(
    public modalController: ModalController,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
/*     this.form.patchValue({
      nome: this.foto.nameimg,
      note: this.foto.noteimg
    }) */
    
  }

  form: FormGroup = this.fb.group({
    nome: [null, [Validators.required]],
    note: [null, [Validators.required]],
  });

  closeModal() {
    this.modalController.dismiss(null, 'cancel');
  }
}
