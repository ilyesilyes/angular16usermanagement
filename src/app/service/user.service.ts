import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { CustomHttpRespose, Profile } from '../interface/appstates';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly server: string = 'http://localhost:8081';

  constructor(private http: HttpClient) { }

  login$ = (email: string, password: string) => <Observable<CustomHttpRespose<Profile>>>
    this.http.post<CustomHttpRespose<Profile>>
      (`${this.server}/user/login`, { email, password })
      .pipe(
        tap((value) => console.log(value)),
        catchError(this.handleError)
      );

  verifyCode$ = (email: string, code: string) => <Observable<CustomHttpRespose<Profile>>>
    this.http.get<CustomHttpRespose<Profile>>
      (`${this.server}/user/verify/code/${email}/${code}`)
      .pipe(
        tap((value) => console.log(value)),
        catchError(this.handleError)
      );

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage: string;
    if (error.error instanceof ErrorEvent) {
      errorMessage = `A client error occured - ${error.error.message}`
    } else {
      if (error.error.reason) {
        errorMessage = error.error.reason;
      } else {
        errorMessage = `An error occured - Error status ${error.status}`
      }
    }
    return throwError(() => errorMessage);
  }
}
