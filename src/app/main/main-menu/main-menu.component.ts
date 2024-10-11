import { Component, input, output, signal } from '@angular/core';
import { DrawerComponent } from '../../common/drawer.component';
import { PkButtonComponent } from '../../common/pk-button.component';
import { WidgetsBarComponent } from './widgets-bar.component';
import { RandomBackgroundComponent } from './random-background.component';
import { MenuWeatherComponent } from './menu-weather.component';
import { MainMenuItemsComponent } from './main-menu-items.component';
import { SettingsComponent } from '../settings/settings.component';
import { ShortcutsSettingsComponent } from '../shortcuts/shortcuts-settings.component';

interface DrawerState {
  title: string;
  size: 'sm' | 'md';
  content: 'menu' | 'settings' | 'shortcuts';
}

interface DrawerStates {
  menu: DrawerState;
  settings: DrawerState;
  shortcuts: DrawerState;
}

const states: DrawerStates = {
  menu: {
    title: 'Start v4',
    size: 'sm',
    content: 'menu',
  },
  settings: {
    title: 'Settings',
    size: 'md',
    content: 'settings',
  },
  shortcuts: {
    title: 'Shortcut tiles',
    size: 'md',
    content: 'shortcuts',
  },
};

@Component({
  selector: 'pk-main-menu',
  standalone: true,
  imports: [
    DrawerComponent,
    PkButtonComponent,
    WidgetsBarComponent,
    RandomBackgroundComponent,
    MenuWeatherComponent,
    MainMenuItemsComponent,
    SettingsComponent,
    ShortcutsSettingsComponent,
  ],
  providers: [],
  styles: ``,
  template: `
    <pk-drawer
      [size]="state().size"
      [name]="state().title"
      [open]="open()"
      [showBack]="state().content !== 'menu'"
      (onClose)="closeDrawer()"
      (onBack)="showMenu()">
      @switch (state().content) {
        @case ('menu') {
          <pk-widgets-bar />
          <hr />
          <pk-menu-weather />
          <hr />
          <pk-random-background />
          <hr />
          <pk-main-menu-items (openSettings)="showSettings()" (openShortcuts)="showShortcuts()" />
        }
        @case ('settings') {
          <pk-settings (done)="showMenu()" />
        }
        @case ('shortcuts') {
          <pk-shortcuts-settings (done)="showMenu()" />
        }
      }
    </pk-drawer>
  `,
})
export class MainMenuComponent {
  public open = input(false);
  public onClose = output<void>();
  public state = signal<DrawerState>(states.menu);

  constructor() {
    document.addEventListener('keyup', (e: KeyboardEvent) => {
      if (this.open() && e.key === 'Escape') {
        this.onClose.emit();
        this.state.set(states.menu);
      }
    });
  }

  public showMenu(): void {
    this.state.set(states.menu);
  }

  public showSettings(): void {
    this.state.set(states.settings);
  }

  public showShortcuts(): void {
    this.state.set(states.shortcuts);
  }

  public closeDrawer(): void {
    this.onClose.emit();
    this.state.set(states.menu);
  }
}
