import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { tablerWaveSawTool } from '@ng-icons/tabler-icons';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'pk-root',
  standalone: true,
  imports: [RouterOutlet, NgIconComponent],
  providers: [provideIcons({ tablerWaveSawTool })],
  template: `
    <h1>
      Welcome to {{ title }}!
      <ng-icon name="tablerWaveSawTool"></ng-icon>
    </h1>

    <router-outlet />
  `,
  styles: [],
})
export class AppComponent {
  title = 'start-v4';

  constructor(private authService: AuthService) {
    this.authService.autoLogin();
  }
}
