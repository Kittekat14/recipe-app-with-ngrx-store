import { ActionReducerMap } from '@ngrx/store';
import * as fromAuth from '../auth/store/auth.reducer';
import * as fromShoppingList from '../shopping-list/store/shopping-list.reducer';

import { ShoppingListActions } from '../shopping-list/store/shopping-list.actions';
import { AuthActions } from '../auth/store/auth.actions';

export interface AppState {
  shoppingList: fromShoppingList.ShoppingListState;
  auth: fromAuth.UserState;
}

export const reducers: ActionReducerMap<
  AppState,
  ShoppingListActions | AuthActions
> = {
  shoppingList: fromShoppingList.shoppingListReducer,
  auth: fromAuth.authReducer,
};
