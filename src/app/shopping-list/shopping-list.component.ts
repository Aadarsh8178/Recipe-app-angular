import { Component, OnDestroy, OnInit } from '@angular/core';
import { ShoppingListService } from './shopping-list.service';
import { Ingredient } from '../shared/ingredients.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit,OnDestroy {
  ingredients:Ingredient[] = []
  private igdChanged:Subscription;
  constructor( private shoppingListService:ShoppingListService) { }

  ngOnInit(): void {
    this.ingredients = this.shoppingListService.getIngredients();
    this.igdChanged =  this.shoppingListService.ingredientsChanged.subscribe( 
      (ingredients:Ingredient[])=>{
        this.ingredients = ingredients
      }
    )
  }

  ngOnDestroy():void {
    this.igdChanged.unsubscribe()
  }

  onEditItem(index: number) {
    this.shoppingListService.startedEditing.next(index);
  }
}
