import { Component, Signal, signal } from '@angular/core';
import { DrawerComponent } from '../common/drawer.component';
import { PkButtonComponent } from '../common/pk-button.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { RandomBackgroundService } from './main-menu/random-background.service';
import { ShortcutsComponent } from './shortcuts/shortcuts.component';

@Component({
  selector: 'pk-main',
  standalone: true,
  imports: [DrawerComponent, PkButtonComponent, MainMenuComponent, ShortcutsComponent],
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

    .open-menu-zone {
      width: 30px;
      height: 30px;
      position: fixed;
      top: 0;
      left: 0;
      border-bottom-right-radius: 50%;

      &:hover {
        background-color: var(--color-primary);
        opacity: 0.3;
      }
    }
  `,
  template: `
    <div class="main-content" [style.background-image]="imageUrl()">
      <div
        class="open-menu-zone"
        (mouseenter)="handleMenuZoneEnter()"
        (mouseleave)="handleMenuZoneLeave()"></div>
      <pk-main-menu [open]="mainMenuOpen()" (onClose)="mainMenuOpen.set(false)" />
      <pk-shortcuts (openMainMenu)="mainMenuOpen.set(!mainMenuOpen())" />
    </div>
  `,
})
export class MainComponent {
  public mainMenuOpen = signal(false);
  public imageUrl: Signal<string | null>;

  private openMenuZoneTimer: ReturnType<typeof setTimeout> | undefined;

  constructor(private randomBackgroundService: RandomBackgroundService) {
    this.imageUrl = this.randomBackgroundService.imageUrl;
  }

  public handleMenuZoneEnter(): void {
    this.openMenuZoneTimer = setTimeout(() => {
      if (!this.mainMenuOpen()) {
        this.mainMenuOpen.set(true);
      }
    }, 300);
  }

  public handleMenuZoneLeave(): void {
    if (this.openMenuZoneTimer) {
      clearTimeout(this.openMenuZoneTimer);
      this.openMenuZoneTimer = undefined;
    }
  }
}
