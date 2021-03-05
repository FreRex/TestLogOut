import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nperf-link',
  templateUrl: './nperf-link.page.html',
  styleUrls: ['./nperf-link.page.scss'],
})
export class NPerfLinkPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  createLink() {

    let coords = (<HTMLInputElement>document.getElementById('coords')).value.split(',');

    let link = "https://www.nperf.com/it/map/IT/-/230.TIM/signal/?ll=" + coords[0] + "&lg=" + coords[1] + "&zoom=13";
    document.getElementById("link1").innerHTML = '<a target="_blank" href="' + link + '">' + link + '</a>';
}

}
