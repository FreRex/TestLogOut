import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonItemSliding } from '@ionic/angular';
import { Room } from '../room.service';

@Component({
  selector: 'app-room-item',
  templateUrl: './room-item.component.html',
  styleUrls: ['./room-item.component.scss'],
})
export class RoomItemComponent implements OnInit {

  @Input() roomItem: Room;
  isFavourite: boolean;
  
  constructor(
    private router: Router
    ) { }

  ngOnInit() {  }

  onDownload() {
    // TODO: logica download foto
    console.log("Foto scaricate");
  }

  onOpenEditPage(slidingItem: IonItemSliding){
    slidingItem.close();
    this.router.navigate(['/', 'rooms', 'edit', this.roomItem.id]);
  }

  onFavoutite(){
    console.log("My favourite room!");
    this.isFavourite = !this.isFavourite;
  }
}