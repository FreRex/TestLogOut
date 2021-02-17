import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  username: string;
  constructor(
    private authService: AuthService,
    private router: Router
    ) { }

  ngOnInit() {
  }

  onLogin(user: string){
    console.log(this.username);    
    this.authService.login(user);
    this.router.navigateByUrl('/projects')
  }

  onLogout(){

  }
}
