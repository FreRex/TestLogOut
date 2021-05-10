import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { Observable, timer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

export const URL = 'https://jsonplaceholder.typicode.com';

@Injectable({
  providedIn: 'root'
})
export class RoomValidator {

  constructor(private http: HttpClient) { }

  searchUsermobile(value) {
    return timer(1000) // debounce
      .pipe(
        switchMap(() => {
          // Check if username is available
          // return this.http.get<any>(`${URL}/users?username=${text}`)
          return this.http
            .post(
              `${environment.apiUrl}/checkum/`,
              { "usermobile": value }
            )
        })
      );
  }

  usermobileValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      return this.searchUsermobile(control.value)
        .pipe(
          map(res => {
            console.log("res", res);
            // return a custom error if username is taken (result is true || false), 
            // otherwise return no error if the array is empty
            return (res == true) ? { 'usermobileExist': true } : null
          })
        );
    };
  }
}