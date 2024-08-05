import { Component, signal } from '@angular/core';
import { DrawerComponent } from '../common/drawer.component';
import { PkButtonComponent } from '../common/pk-button.component';
import { MainMenuComponent } from './main-menu/main-menu.component';

@Component({
  selector: 'pk-main',
  standalone: true,
  imports: [DrawerComponent, PkButtonComponent, MainMenuComponent],
  template: `
    <p>main works!</p>
    <pk-button (onClick)="mainMenuOpen.set(true)">Open drawer</pk-button>
    <pk-main-menu [open]="mainMenuOpen()" (onClose)="mainMenuOpen.set(false)" />
  `,
  styles: ``,
})
export class MainComponent {
  public mainMenuOpen = signal(false);
}
