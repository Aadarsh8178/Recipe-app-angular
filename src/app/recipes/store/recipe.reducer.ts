import * as RecipeActions from './recipe.action';
import { Recipe } from "../recipe.model";

export interface State {
  recipes: Recipe[]
}
const initState:State = {
  recipes: []
}
export const RecipeReducer = (state = initState,action:RecipeActions.RecipeAction) => {

  switch(action.type){
    case RecipeActions.SET_RECIPES:
      return {
        ...state,
        recipes: [...action.payload]
      }
    case RecipeActions.ADD_RECIPE:
      return {
        ...state,
        recipes: [...state.recipes,action.payload]
      }
    case RecipeActions.UPDATE_RECIPE:
      let recipes = [...state.recipes];
      recipes[action.payload.index] = { ...action.payload.recipe};
      return {
        ...state,
        recipes:recipes
      }
    case RecipeActions.DELETE_RECIPE:
      return {
        ...state,
        recipes: state.recipes.filter( (item,ind) => ind !== action.payload)
      }
    default :
      return state
  }
}