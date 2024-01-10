import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, map, of, startWith } from 'rxjs';
import { DataState } from 'src/app/enum/datastate.enum';
import { Key } from 'src/app/enum/key.enum';
import { LoginState } from 'src/app/interface/appstates';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {


  loginState$: Observable<LoginState> = of({ dataState: DataState.LOADED}); 
  private phoneSubject = new BehaviorSubject<string | null>(null);
  private emailSubject = new BehaviorSubject<string | null>(null);
  readonly DataState = DataState;

  constructor(private router: Router, private userService: UserService) { }

  login(loginForm: NgForm): void {
    this.loginState$ = this.userService.login$(loginForm.value.email, loginForm.value.password)
      .pipe(
        map(response => {
          if (response.data.user.isUsingMfa) {
            this.phoneSubject.next(response.data.user.phone);
            this.emailSubject.next(response.data.user.email);
            return { dataState: DataState.LOADED, isUsingMfa: true, loginSuccess: false, phone: response.data.user.phone.substring(response.data.user.phone.length - 4) };
          } else {
            localStorage.setItem(Key.TOKEN, response.data.access_token);
            localStorage.setItem(Key.REFRESH_TOKEN, response.data.access_token);
            this.router.navigate(['/']);
            return { dataState: DataState.LOADED, loginSuccess: true };

          }
        }),
        startWith({ dataState: DataState.LOADING, isUsingMfa: false }),
        catchError((error: string) => {
          return of({ dataState: DataState.ERROR, isUsingMfa: false, loginSuccess: false, error });
        })
      )
  }
  verifyCode(verifyCodeForm: NgForm): void {
    // this.loginState$ = this.userService.login$(loginForm.value.email, loginForm.value.password)
    //   .pipe(
    //     map(response => {
    //       if (response.data.user.isUsingMfa) {
    //         this.phoneSubject.next(response.data.user.phone);
    //         this.emailSubject.next(response.data.user.email);
    //         return { dataState: DataState.LOADED, isUsingMfa: true, loginSuccess: false, phone: response.data.user.phone.substring(response.data.user.phone.length - 4) };
    //       } else {
    //         localStorage.setItem(Key.TOKEN, response.data.access_token);
    //         localStorage.setItem(Key.REFRESH_TOKEN, response.data.access_token);
    //         this.router.navigate(['/']);
    //         return { dataState: DataState.LOADED, loginSuccess: true };

    //       }
    //     }),
    //     startWith({ dataState: DataState.LOADING, isUsingMfa: false }),
    //     catchError((error: string) => {
    //       return of({ dataState: DataState.ERROR, isUsingMfa: false, loginSuccess: false, error });
    //     })
    //   )
  }

  loginPage(): void {
    this.loginState$ = of({ dataState: DataState.LOADED });
}


}

