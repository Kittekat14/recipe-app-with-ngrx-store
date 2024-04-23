import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlertComponent } from './alert/alert.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { DropdownDirective } from './dropdown.directive';
// import { LoggingService } from '../logging.service';

@NgModule({
  declarations: [AlertComponent, LoadingSpinnerComponent, DropdownDirective],
  // providers: [LoggingService],
  imports: [CommonModule],
  exports: [
    // app.module is the only module with BrowserModule (only used once!);
    // in all other modules, use CommonModule
    CommonModule,
    AlertComponent,
    LoadingSpinnerComponent,
    DropdownDirective,
  ],
})
export class SharedModule {}
