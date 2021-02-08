import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Recipe } from './recipe.model';
import { Store } from '@ngrx/store';
import { Actions,ofType} from '@ngrx/effects';
import * as fromApp from '../store/app.reducer';
import * as RecipeActions from '../recipes/store/recipe.action';
import { map, switchMap, take } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecipesResolverService implements Resolve<Recipe[]> {
  constructor(
    private store: Store<fromApp.AppState>,
    private action$: Actions
  ) { }

  resolve(route:ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.store.select('recipe').pipe(
      take(1),
      map(recipeState => {
        return recipeState.recipes
      }),
      switchMap(recipes => {
        if(recipes.length === 0) {
          this.store.dispatch(new RecipeActions.FetchRecipes());
          return this.action$.pipe(ofType(RecipeActions.SET_RECIPES), take(1));
        } else {
          return of(recipes)
        }
      })
    )
    
  }
}
