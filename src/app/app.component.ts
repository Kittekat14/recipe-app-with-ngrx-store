import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { LoggingService } from './logging.service';

import * as AuthActions from './auth/store/auth.actions';
import { Store } from '@ngrx/store';
import { AppState } from './rootStore/app.reducer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private loggingService: LoggingService,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.store.dispatch(new AuthActions.AutoLogin());
    // this.authService.autoLogin();

    this.loggingService.printLog('Hello from App Component ngOninit');
  }
}
