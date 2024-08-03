import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'pk-root',
  standalone: true,
  imports: [RouterOutlet],
  providers: [],
  template: ` <router-outlet /> `,
  styles: ``,
})
export class AppComponent {
  title = 'start-v4';

  constructor(private authService: AuthService) {
    this.authService.autoLogin();
  }
}
