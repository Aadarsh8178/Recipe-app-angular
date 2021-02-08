import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Recipe } from '../recipe.model';
import * as fromApp from '../../store/app.reducer';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit,OnDestroy {
  recipes:Recipe[] = [];
  subscription:Subscription;
  constructor( private store:Store<fromApp.AppState> ) {}

  ngOnInit(): void {
    this.subscription = this.store.select('recipe').subscribe(
      recipeState => {
        this.recipes = recipeState.recipes
      }
    )
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

}
