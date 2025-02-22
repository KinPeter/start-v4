import { Component, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { NotificationLogComponent } from './common/notification-log.component';
import { NotificationService } from './services/notification.service';
import { environment } from '../environments/environment';
import { SharedWorkerService } from './services/shared-worker.service';

@Component({
  selector: 'pk-root',
  imports: [RouterOutlet, NotificationLogComponent],
  providers: [],
  template: ` <router-outlet />
    <pk-notification-log />`,
  styles: ``,
})
export class AppComponent implements OnDestroy {
  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private sharedWorkerService: SharedWorkerService
  ) {
    this.authService.autoLogin();
    this.sharedWorkerService.initiate();
    this.notificationService.showLog('Welcome to Start version ' + environment.version);
  }

  ngOnDestroy(): void {
    this.sharedWorkerService.close();
  }
}
