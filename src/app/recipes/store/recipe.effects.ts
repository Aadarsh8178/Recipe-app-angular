import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { map, switchMap, withLatestFrom } from "rxjs/operators";
import { Recipe } from "../recipe.model";

import * as RecipesActions from './recipe.action';
import * as fromApp from '../../store/app.reducer';

@Injectable()
export class RecipeEffects {
  baseURL = 'https://recipe-app-56c7d-default-rtdb.firebaseio.com/recipes.json'
  
  @Effect()
  fetchRecipes = this.action$.pipe(
    ofType(RecipesActions.FETCH_RECIPES),
    switchMap(()=> {
      return this.http.get<Recipe[]>(this.baseURL)
    }),
    map(recipes => {
      return recipes.map(recipe => {
        return { ...recipe, ingredients:recipe.ingredients ? recipe.ingredients : null}
      })
    }),
    map( recipes => new RecipesActions.SetRecipes(recipes))
  )

  @Effect({dispatch:false})
  storeRecipe = this.action$.pipe(
    ofType(RecipesActions.STORE_RECIPE),
    withLatestFrom(this.store.select('recipe')),
    switchMap(([actionData,recipeState]) => {
      return this.http.put(this.baseURL,recipeState.recipes)
    })
  )
  constructor(private action$: Actions,private http:HttpClient,private store:Store<fromApp.AppState>){}
}