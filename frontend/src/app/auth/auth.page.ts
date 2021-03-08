import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  username: string;
  password: string;
  isLogin: boolean = true;

  constructor(
    private authService: AuthService,
    private router: Router
    ) { }

  ngOnInit() {
  }

  // onLogin(){
  //   console.log(this.username);   
  //   this.authService.login(this.username);
  //   this.router.navigateByUrl('/rooms'); 
  // }

  onSubmit(form: NgForm){
    if(!form.valid){
      return;
    }
    const email = form.value.username;
    const password = form.value.password;

    if(this.isLogin){
      this.authService.login(this.username);
      this.router.navigateByUrl('/rooms');
      form.reset();
    } 
    else {
      //TODO: logica sign up
    }
  }
}
