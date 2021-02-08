import { Component, OnDestroy, OnInit } from '@angular/core';
import { Ingredient } from '../shared/ingredients.model';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as SLActions from './store/shopping-list.actions';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit,OnDestroy {
  ingredients: Observable<{ingredients: Ingredient[]}>;
  // private igdChanged:Subscription;
  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.ingredients = this.store.select('shoppingList');
    console.log('Shopping HERE')
    // this.ingredients = this.shoppingListService.getIngredients();
    // this.igdChanged =  this.shoppingListService.ingredientsChanged.subscribe( 
    //   (ingredients:Ingredient[])=>{
    //     this.ingredients = ingredients
    //   }
    // )
  }

  ngOnDestroy():void {
    // this.igdChanged.unsubscribe()
  }

  onEditItem(index: number) {
    // this.shoppingListService.startedEditing.next(index);
    this.store.dispatch(new SLActions.StartEdit(index));
  }
}
