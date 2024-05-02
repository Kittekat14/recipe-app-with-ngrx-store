import { Action } from '@ngrx/store';
import { Recipe } from '../recipe.model';

export const SET_RECIPES = '[Recipes] SET RECIPES';
export const FETCH_RECIPES = '[Recipes] FETCH RECIPES';
export const ADD_RECIPE = '[Recipes] ADD RECIPE';
export const UPDATE_RECIPE = '[Recipes] UPDATE RECIPE';
export const DELETE_RECIPE = '[Recipes] DELETE RECIPE';
export const STORE_RECIPES = '[Recipes] STORE RECIPES';

export class setRecipes implements Action {
  readonly type = SET_RECIPES;

  constructor(public payload: Recipe[]) {}
}

export class fetchRecipes implements Action {
  readonly type = FETCH_RECIPES;

  constructor() {}
}

export class addRecipe implements Action {
  readonly type = ADD_RECIPE;

  constructor(public payload: Recipe) {}
}
export class updateRecipe implements Action {
  readonly type = UPDATE_RECIPE;

  constructor(public payload: { index: number; newRecipe: Recipe }) {}
}

export class deleteRecipe implements Action {
  readonly type = DELETE_RECIPE;

  constructor(public payload: number) {}
}

export class storeRecipes implements Action {
  readonly type = STORE_RECIPES;

  constructor() {}
}

export type RecipesActions =
  | setRecipes
  | fetchRecipes
  | addRecipe
  | updateRecipe
  | deleteRecipe
  | storeRecipes;
