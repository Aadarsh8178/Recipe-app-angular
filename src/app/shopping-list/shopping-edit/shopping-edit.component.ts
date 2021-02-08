import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredients.model';
import * as fromApp from '../../store/app.reducer';
import * as SLActions from '../store/shopping-list.actions';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit,OnDestroy {
  @ViewChild('f',{static:false}) slForm: NgForm;
  subscription: Subscription;
  editMode = false;
  editedItem: Ingredient;

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.subscription = this.store.select('shoppingList').subscribe(
      stateData => {
        if(stateData.editedIngredientIndex > -1) {
          this.editMode = true;
          this.editedItem = stateData.editedIngredient;
          this.slForm.setValue({
            name: this.editedItem.name,
            amount: this.editedItem.amount
          })
        } else {
          this.editMode = false
        }
      }
    )
    
  }

  onAddItem(form: NgForm) {
    const newIngredient = new Ingredient(form.value.name,form.value.amount);
 
    if(this.editMode){
      // this.shoppingListService.updateIngredient(this.editedItemIndex,newIngredient);
      this.store.dispatch(new SLActions.UpdateIngredient(newIngredient))
    } else {
      // this.shoppingListService.addIngredient(newIngredient);
      this.store.dispatch(new SLActions.AddIngredient(newIngredient))
    } 
    this.onClear()
  }

  onClear(){
    this.editMode = false;
    this.slForm.reset();
    this.store.dispatch(new SLActions.StopEdit())
  }

  onDelete(){
    // this.shoppingListService.deleteIngredient(this.editedItemIndex);
    this.store.dispatch(new SLActions.DeleteIngredient())
    this.onClear()
  }
  ngOnDestroy(){
    this.subscription.unsubscribe();
    this.store.dispatch(new SLActions.StopEdit())
  }
}
