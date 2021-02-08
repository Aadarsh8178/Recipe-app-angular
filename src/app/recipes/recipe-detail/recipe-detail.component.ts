import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

import { Recipe } from '../recipe.model';
import * as fromApp from '../../store/app.reducer';
import * as RecipeActions from '../store/recipe.action';
import * as SLActions from '../../shopping-list/store/shopping-list.actions';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe:Recipe;
  id:number;
  constructor(
    private route:ActivatedRoute,
    private router:Router,
    private store:Store<fromApp.AppState>
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.route.params.subscribe(
      (params:Params)=>{
        this.id = +params['id'];
        this.store.select('recipe')
          .pipe(
            map( recipeState => {
              return recipeState.recipes.find((recipe,index)=> index===this.id)
            })
          ).subscribe(recipe => this.recipe = recipe)
        }
      )
  }
  addIngredients(){
    // this.slService.addMultipleIngredients(this.recipe.ingredients);
    // this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
    this.store.dispatch(new SLActions.AddIngredients(this.recipe.ingredients));
  }
  onDelete(){
    // this.recipeService.deleteRecipe(this.id)
    this.store.dispatch(new RecipeActions.DeleteRecipe(this.id))
    this.router.navigate(['../'],{relativeTo:this.route});
  }
}
