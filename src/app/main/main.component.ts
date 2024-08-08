import { Component, Signal, signal } from '@angular/core';
import { DrawerComponent } from '../common/drawer.component';
import { PkButtonComponent } from '../common/pk-button.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { RandomBackgroundService } from './main-menu/random-background.service';

@Component({
  selector: 'pk-main',
  standalone: true,
  imports: [DrawerComponent, PkButtonComponent, MainMenuComponent],
  styles: `
    .main-content {
      width: 100%;
      height: 100vh;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 1rem;
      overflow-y: auto;
      padding: 1rem;
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
    }
  `,
  template: `
    <div class="main-content" [style.background-image]="imageUrl()">
      <pk-button (onClick)="mainMenuOpen.set(true)">Open drawer</pk-button>
      <pk-main-menu [open]="mainMenuOpen()" (onClose)="mainMenuOpen.set(false)" />
    </div>
  `,
})
export class MainComponent {
  public mainMenuOpen = signal(false);
  public imageUrl: Signal<string | null>;

  constructor(private randomBackgroundService: RandomBackgroundService) {
    this.imageUrl = this.randomBackgroundService.imageUrl;
  }
}
