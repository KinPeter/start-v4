import { Component, input, output, signal } from '@angular/core';
import { DrawerComponent } from '../../common/drawer.component';
import { PkButtonComponent } from '../../common/pk-button.component';
import { WidgetsBarComponent } from './widgets-bar.component';
import { RandomBackgroundComponent } from './random-background.component';
import { MenuWeatherComponent } from './menu-weather.component';

@Component({
  selector: 'pk-main-menu',
  standalone: true,
  imports: [
    DrawerComponent,
    PkButtonComponent,
    WidgetsBarComponent,
    RandomBackgroundComponent,
    MenuWeatherComponent,
  ],
  providers: [],
  styles: ``,
  template: `
    <pk-drawer [size]="drawerSize()" name="Start v4" [open]="open()" (onClose)="onClose.emit()">
      <pk-widgets-bar />
      <hr />
      <pk-menu-weather></pk-menu-weather>
      <hr />
      <pk-random-background />
      <hr />
      <pk-button (onClick)="changeSize()">Go!</pk-button>
    </pk-drawer>
  `,
})
export class MainMenuComponent {
  public open = input(false);
  public onClose = output<void>();
  public drawerSize = signal<'sm' | 'md'>('sm');

  public changeSize() {
    this.drawerSize.update(size => (size === 'md' ? 'sm' : 'md'));
  }
}