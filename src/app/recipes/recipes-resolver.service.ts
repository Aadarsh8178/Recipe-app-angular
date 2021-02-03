import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { DataStorageService } from '../shared/data-storage.service';
import { Recipe } from './recipe.model';
import { RecipeService } from './recipe.service';

@Injectable({
  providedIn: 'root'
})
export class RecipesResolverService implements Resolve<Recipe[]> {
  constructor(private dsService:DataStorageService,private rService:RecipeService) { }

  resolve(route:ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if(this.rService.getRecipes().length === 0){
      return this.dsService.fetchRecipes();
    } else {
      return this.rService.getRecipes();
    }
  }
}
