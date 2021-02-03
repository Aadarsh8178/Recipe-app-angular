import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from './user.model';
import { environment } from '../../environments/environment';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn:string;
  localId: string;
  registered? : boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;

  apiKey = environment.firebaseAPIKey;
  constructor(private http:HttpClient,private router:Router){}

  signup(email:string,password:string) {
    let url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.apiKey}`
    return this.http.post<AuthResponseData>(url,{
      email,
      password,
      returnSecureToken:true
    }).pipe(catchError(this.handleError), tap(resData => {
      this.handleAuthentication(resData.email,resData.localId,resData.idToken,+resData.expiresIn)
    }))
  }

  autoLogin(){
    const userData:{
      email:string;
      id:string;
      _token:string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));
    if(!userData){
      return;
    }

    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if(loadedUser.token){
      const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - 
      new Date().getTime();

      this.autoLogout(expirationDuration)
      this.user.next(loadedUser);
    }
  } 
  login(email:string,password:string) {
    let url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.apiKey}`

    return this.http.post<AuthResponseData>(url,{
      email,
      password,
      returnSecureToken:true
    }).pipe(catchError(this.handleError), tap(resData => {
      this.handleAuthentication(resData.email,resData.localId,resData.idToken,+resData.expiresIn)
    }))
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['auth']);
    localStorage.removeItem('userData');
    if(this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
   this.tokenExpirationTimer = setTimeout(()=> this.logout(),expirationDuration);
  }
  private handleAuthentication(email: string,userId: string,token: string, expiresIn: number) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);

    const user = new User(
      email,
      userId,
      token,
      expirationDate
    )
    this.user.next(user);
    this.autoLogout(expiresIn*1000)
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occured';

    if(!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage)
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
    return throwError(errorMessage);
  }
}
