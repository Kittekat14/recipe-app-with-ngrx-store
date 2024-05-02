import { ActionReducerMap } from '@ngrx/store';
import * as fromAuth from '../auth/store/auth.reducer';
import * as fromShoppingList from '../shopping-list/store/shopping-list.reducer';
import * as fromRecipes from '../recipes/store/recipes.reducers';
import * as fromRouter from '@ngrx/router-store';

import { ShoppingListActions } from '../shopping-list/store/shopping-list.actions';
import { AuthActions } from '../auth/store/auth.actions';
import { RecipesActions } from '../recipes/store/recipes.actions';

export interface AppState {
  shoppingList: fromShoppingList.ShoppingListState;
  auth: fromAuth.UserState;
  recipes: fromRecipes.RecipesState;
  router: fromRouter.RouterReducerState;
}

export const reducers: ActionReducerMap<
  AppState,
  ShoppingListActions | AuthActions | RecipesActions
> = {
  shoppingList: fromShoppingList.shoppingListReducer,
  auth: fromAuth.authReducer,
  recipes: fromRecipes.recipesReducer,
  router: fromRouter.routerReducer,
};
