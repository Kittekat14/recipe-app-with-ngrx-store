import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Recipe } from './recipe.model';

import { Store } from '@ngrx/store';
import { AppState } from '../rootStore/app.reducer';
import * as RecipesActions from './store/recipes.actions';
import { Actions, ofType } from '@ngrx/effects';
import { map, switchMap, take } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecipesResolverService implements Resolve<Recipe[]> {
  constructor(private store: Store<AppState>, private actions$: Actions) {}

  // resolver will subscribe for us; resolver loads the data before the page is loaded
  // resolver expects observable as a return value and waits for the observable to complete
  // before it loads the route for which we added this resolver
  // Here with ngrx now, it will instantly resolve and load the route before we have the actual data from the Fetch
  resolve() {
    return this.store.select('recipes').pipe(
      take(1),
      map((recipesState) => {
        return recipesState.recipes;
      }),
      switchMap((recipes) => {
        if (recipes.length === 0) {
          // Problem: when we dispatch we don't get an Observable back!
          // Solution: we can use effects that return an Observable in here too!
          this.store.dispatch(new RecipesActions.fetchRecipes());
          return this.actions$.pipe(
            ofType(RecipesActions.SET_RECIPES),
            take(1)
          );
        } else {
          return of(recipes);
        }
      })
    );

    // now the resolver waits for the recipes to be set (he knows this way that they are there!)
    // takes 1 action and unsubscribes immediately!
    // const recipes = this.recipesService.getRecipes();

    // if (recipes.length === 0) {
    //   return this.dataStorageService.fetchRecipes();
    // } else {
    //   return recipes;
    // }
  }
}
