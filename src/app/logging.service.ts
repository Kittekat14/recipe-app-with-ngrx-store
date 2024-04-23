import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoggingService {
  lastlog: string;

  printLog(message: string) {
    // saving last log to show, that no matter what component using the service, it's always the same printLog method
    console.log(message);
    console.log(this.lastlog);
    this.lastlog = message;
  }
}
