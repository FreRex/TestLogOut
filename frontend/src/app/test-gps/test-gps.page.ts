import { Component, OnInit } from '@angular/core';
import { setInterval } from 'timers/promises';

@Component({
  selector: 'app-test-gps',
  templateUrl: './test-gps.page.html',
  styleUrls: ['./test-gps.page.scss'],
})
export class TestGpsPage implements OnInit {
  

  constructor() { 
  
  }

  ngOnInit() {    
    window.setInterval(() => this.getLocation(), 10000);    
  }

  /* ionViewDidLoad() {
    this.getLocation();
    //setInterval(this.getLocation(),4000); 
  } */
 

  getLocation() {
    if (navigator.geolocation) {
     navigator.geolocation.getCurrentPosition(this.showPosition);
    } else { 
      document.getElementById("demo").innerHTML = "Geolocation is not supported by this browser.";
    }
  }

  showPosition(position) {

    var node = document.createElement("LI");
    var textnode = document.createTextNode("Lat: " + position.coords.latitude + " - Long: " + position.coords.longitude);
    node.appendChild(textnode);
    document.getElementById("demo").appendChild(node);
   
  }

}
