import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as RecipesActions from './recipes.actions';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Recipe } from '../recipe.model';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/rootStore/app.reducer';

@Injectable()
export class RecipeEffects {
  // EFFECTS always must return a new action at the end!!! Otherwise: {dispatch: false}
  fetchRecipes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RecipesActions.FETCH_RECIPES),
      switchMap(() => {
        return this.http.get<Recipe[]>(
          'https://recipe-app-3d79a-default-rtdb.europe-west1.firebasedatabase.app/recipes.json',
          {
            headers: {
              'Access-Control-Allow-Origin': '*',
            },
          }
        );
      }),
      map((recipes) => {
        return recipes.map((recipe) => {
          return {
            ...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients : [],
          };
        });
      }),
      map((recipes) => {
        return new RecipesActions.setRecipes(recipes);
      })
    )
  );

  storeRecipes$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(RecipesActions.STORE_RECIPES),
        withLatestFrom(this.store.select('recipes')),
        switchMap(([actionData, recipesState]) => {
          return this.http.put(
            'https://recipe-app-3d79a-default-rtdb.europe-west1.firebasedatabase.app/recipes.json',
            recipesState.recipes,
            {
              headers: {
                'Access-Control-Allow-Origin': '*',
              },
            }
          );
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<AppState>
  ) {}
}
