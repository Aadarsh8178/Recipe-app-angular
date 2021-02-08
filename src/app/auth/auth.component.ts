import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as fromApp from '../store/app.reducer'; 
import * as AuthActions from '../auth/store/auth.actions'; 
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit,OnDestroy {
  isLoginMode = true;
  isLoading = false;
  error: string = null;
  subsscription: Subscription
  constructor(
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit() {
    this.subsscription = this.store.select('auth').subscribe(authState => {
      this.isLoading = authState.loading,
      this.error = authState.authError
    })
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form:NgForm){
    if(!form.valid){
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    if(this.isLoginMode) {
      this.store.dispatch(
        new AuthActions.LoginStart({email,password})
      )
    } else {
      this.store.dispatch(new AuthActions.SignupStart({email,password}))
    }

    form.reset()
  }

  onHandleError(){
    this.store.dispatch(
      new AuthActions.ClearError()
    )
  }
  ngOnDestroy(){
    this.subsscription.unsubscribe()
  }
}
