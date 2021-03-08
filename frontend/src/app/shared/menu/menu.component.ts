import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  // TODO: non si aggiorna quando faccio login, rendere this.authService.userIsAthenticated un osservabile
  isLoggedIn: boolean;

  constructor(
    private authService: AuthService, 
    private router: Router) { }

  ngOnInit() {
    this.isLoggedIn = this.authService.userIsAthenticated;
  }

  onLogout(){
    this.authService.logout();
    this.router.navigateByUrl('/auth');
    this.isLoggedIn = this.authService.userIsAthenticated;
  }

  onLogin(){
    this.router.navigateByUrl('/auth');
  }
}
