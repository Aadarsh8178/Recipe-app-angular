import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, tap } from 'rxjs/operators';
import { AuthService } from "../auth/auth.service";

import { Recipe } from "../recipes/recipe.model";
import { RecipeService } from "../recipes/recipe.service";

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  baseURL = 'https://recipe-app-56c7d-default-rtdb.firebaseio.com/recipes.json'
  constructor(private http:HttpClient,private recipeService: RecipeService,private authService:AuthService){}

  storeRecipes(){
    const recipes = this.recipeService.getRecipes();
    this.http.put(this.baseURL,recipes).subscribe((response)=>console.log(response))
  }

  fetchRecipes(){
    
    return this.http.get<Recipe[]>(this.baseURL).pipe(map(recipes => {
      return recipes.map(recipe => {
        return { ...recipe, ingredients:recipe.ingredients ? recipe.ingredients : null}
      })
    }),
    tap(recipes => {
      this.recipeService.setRecipes(recipes);
    })
    )
  }

}