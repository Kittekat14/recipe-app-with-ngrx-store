import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { Ingredient } from '../shared/ingredient.model';
// import { ShoppingListService } from './shopping-list.service';
import { LoggingService } from '../logging.service';
import { Store } from '@ngrx/store';
import * as ShoppingListActions from './store/shopping-list.actions';
import * as fromShoppingList from './store/shopping-list.reducer';
import { AppState } from '../rootStore/app.reducer';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Observable<{ ingredients: Ingredient[] }>;
  private subscription: Subscription;

  constructor(
    // private slService: ShoppingListService,
    private loggingService: LoggingService,
    // store holds our self-set key which points at the reducer giving back the shoppingList piece of state
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    // when selecting from store the self-set key of the piece of state is a string all of a sudden
    this.ingredients = this.store.select('shoppingList');

    this.subscription = this.ingredients.subscribe();

    // NOT USING SERVICE, BUT STORE NOW!
    // this.ingredients = this.slService.getIngredients();
    // this.subscription = this.slService.ingredientsChanged.subscribe(
    //   (ingredients: Ingredient[]) => {
    //     this.ingredients = ingredients;
    //   }
    // );

    this.loggingService.printLog('Hello from ShoppingListComponent ngOnInit!');
  }

  onEditItem(index: number) {
    // this.slService.startedEditing.next(index);

    this.store.dispatch(new ShoppingListActions.StartUpdateIngredient(index));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
