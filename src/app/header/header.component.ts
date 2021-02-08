import {Component, OnDestroy, OnInit} from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

import * as fromApp from '../store/app.reducer';
import * as RecipeActions from '../recipes/store/recipe.action';

@Component({
  selector: 'app-header',
  templateUrl:'./header.component.html'
})

export class HeaderComponent implements OnInit,OnDestroy {
  private subscription: Subscription;
  isAuthenticated = false;

  constructor(
    private authService:AuthService,
    private store: Store<fromApp.AppState>){}

  ngOnInit(){
    // this.authService.user.subscribe(
    //   (user:User)=>{
    //     this.isAuthenticated = !!user;
    //   }
    // )
    this.store.select('auth').subscribe(
      (store)=>{
        this.isAuthenticated = !!store.user;
      }
    )
  }
  onSaveData(){
    this.store.dispatch(new RecipeActions.StoreRecipe());
  }
  onFetchData(){
    // this.dsService.fetchRecipes().subscribe();
    this.store.dispatch(new RecipeActions.FetchRecipes())
  } 
  onLogout(){
    this.authService.logout();
  }
  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

}