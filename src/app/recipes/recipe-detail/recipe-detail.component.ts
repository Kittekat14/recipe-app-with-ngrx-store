import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { map, switchMap } from 'rxjs/operators';

import { Recipe } from '../recipe.model';

import { AppState } from 'src/app/rootStore/app.reducer';
import * as RecipesActions from '../store/recipes.actions';
import * as ShoppingListActions from '../../shopping-list/store/shopping-list.actions';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css'],
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  id: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.route.params
      .pipe(
        map((params: Params) => {
          return +params['id'];
        }),
        // switchMap(): switching Observables from routeParams Observable to store Observable
        switchMap((id) => {
          this.id = id;
          return this.store.select('recipes');
        }),
        map((recipeState) => {
          return recipeState.recipes.find((recipe, index) => {
            return this.id === index;
          });
        })
      )
      .subscribe((recipe) => {
        this.recipe = recipe;
      });

    // this.recipe = this.recipeService.getRecipe(this.id);
  }

  onAddToShoppingList() {
    this.store.dispatch(
      new ShoppingListActions.AddIngredients(this.recipe.ingredients)
    );
    // this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
  }

  onEditRecipe() {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  onDeleteRecipe() {
    this.store.dispatch(new RecipesActions.deleteRecipe(this.id));

    // this.recipeService.deleteRecipe(this.id);

    this.router.navigate(['/recipes']);
  }
}
