import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { NotificationLogComponent } from './common/notification-log.component';
import { NotificationService } from './services/notification.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'pk-root',
  standalone: true,
  imports: [RouterOutlet, NotificationLogComponent],
  providers: [],
  template: ` <router-outlet />
    <pk-notification-log />`,
  styles: ``,
})
export class AppComponent {
  title = 'start-v4';

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService
  ) {
    this.authService.autoLogin();
    this.notificationService.showLog('Welcome to Start version ' + environment.version);
  }
}
