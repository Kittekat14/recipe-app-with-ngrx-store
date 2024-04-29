import { Action } from '@ngrx/store';
import { Ingredient } from '../../shared/ingredient.model';

// action types
export const ADD_INGREDIENT = 'ADD_INGREDIENT';
export const ADD_INGREDIENTS = 'ADD_INGREDIENTS';
export const UPDATE_INGREDIENT = 'UPDATE_INGREDIENT';
export const START_UPDATE_INGREDIENT = 'START_UPDATE_INGREDIENT';
export const STOP_UPDATE_INGREDIENT = 'STOP_UPDATE_INGREDIENT';
export const DELETE_INGREDIENT = 'DELETE_INGREDIENT';

// action object
export class AddIngredient implements Action {
  readonly type = ADD_INGREDIENT;
  constructor(public payload: Ingredient) {}
}

export class AddIngredients implements Action {
  readonly type = ADD_INGREDIENTS;
  constructor(public payload: Ingredient[]) {}
}

export class UpdateIngredient implements Action {
  readonly type = UPDATE_INGREDIENT;
  constructor(public payload: Ingredient) {}
}
export class StartUpdateIngredient implements Action {
  readonly type = START_UPDATE_INGREDIENT;
  constructor(public payload: number) {}
}
export class StopUpdateIngredient implements Action {
  readonly type = STOP_UPDATE_INGREDIENT;
  constructor() {}
}

export class DeleteIngredient implements Action {
  readonly type = DELETE_INGREDIENT;
  constructor() {}
}

export type ShoppingListActions =
  | AddIngredient
  | AddIngredients
  | UpdateIngredient
  | DeleteIngredient
  | StartUpdateIngredient
  | StopUpdateIngredient;
