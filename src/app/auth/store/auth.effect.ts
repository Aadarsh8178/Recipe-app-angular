import { HttpClient } from "@angular/common/http";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { catchError, map, switchMap, tap } from "rxjs/operators";
import * as AuthActions from './auth.actions';
import { environment } from '../../../environments/environment';
import { of } from "rxjs";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { User } from "../user.model";

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn:string;
  localId: string;
  registered? : boolean;
}
const handleAuthentication = (email:string,userId:string,token:string,expiresIn:number) => {
  const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
  const user = new User(
    email,
    userId,
    token,
    expirationDate
  )
  localStorage.setItem('userData', JSON.stringify(user));
  return new AuthActions.AuthenticateSuccess({
      email,
      userId,
      token,
      expirationDate,
      redirect:true
    })
}
const handleError = (errorRes:any)=> {

  let errorMessage = 'An unknown error occured';
  if(!errorRes.error || !errorRes.error.error) {
    return of(new AuthActions.AuthenticateFail(errorMessage))
  }
  switch(errorRes.error.error.message) {
    case 'EMAIL_EXISTS':
        errorMessage = 'This email exists already';
        break;
    case "INVALID_PASSWORD":
    case 'EMAIL_NOT_FOUND':
      errorMessage = "Email or password is not correct";
      break;
  }
  return of(new AuthActions.AuthenticateFail(errorMessage))
}
@Injectable()
export class AuthEffects {

  @Effect()
  authSignup = this.actions$.pipe(
    ofType(AuthActions.SIGNUP_START),
    switchMap((signupAction: AuthActions.SignupStart)=> {
      let url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`
      return this.http.post<AuthResponseData>(url,{
        email: signupAction.payload.email,
        password: signupAction.payload.password,
        returnSecureToken:true
      }).pipe(
        map(resData => handleAuthentication(resData.email,resData.localId,resData.idToken,+resData.expiresIn)
        ),
        catchError(errorRes => handleError(errorRes)) 
      )
    })
  )
  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
      let url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`
      return this.http.post<AuthResponseData>(url,{
        email: authData.payload.email,
        password: authData.payload.password,
        returnSecureToken:true
      }).pipe(
        map(resData => handleAuthentication(resData.email,resData.localId,resData.idToken,+resData.expiresIn)
        ),
        catchError(errorRes => handleError(errorRes)) 
      )
    })
  )

  @Effect({ dispatch: false })
  authSuccess = this.actions$.pipe(
    ofType(AuthActions.AUTHENTICATE_SUCCESS),
    tap((authSuccessAction: AuthActions.AuthenticateSuccess)=> {
      if(authSuccessAction.payload.redirect) this.router.navigate(['/'])
    })
  )
  constructor(private actions$: Actions,private http: HttpClient,private router: Router) {}
}