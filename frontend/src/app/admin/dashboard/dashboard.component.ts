import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  coordinate: string = '';

  constructor() { }

  ngOnInit() { }

  createLink() {
    let coords = this.coordinate.replace(' ', '').split(',');
    window.open("https://www.nperf.com/it/map/IT/-/230.TIM/signal/?ll=" + coords[0] + "&lg=" + coords[1] + "&zoom=13");
  }
}
