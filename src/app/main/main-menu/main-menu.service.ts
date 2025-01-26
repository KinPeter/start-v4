import { computed, effect, Injectable, signal } from '@angular/core';
import { ClearSwipeHandlers, detectSwipeRight } from '../../utils/swipe-handlers';

@Injectable({ providedIn: 'root' })
export class MainMenuService {
  private isMenuOpen = signal(false);
  private openMenuZoneTimer: ReturnType<typeof setTimeout> | undefined;

  public isMainMenuOpen = computed(() => this.isMenuOpen());

  constructor() {
    effect(() => {
      if (this.isMenuOpen()) {
        document.getElementById('widget-toggle-notes')?.focus();
      }
    });
  }

  public toggleMainMenu(): void {
    this.isMenuOpen.set(!this.isMenuOpen());
  }

  public openMainMenu(): void {
    this.isMenuOpen.set(true);
  }

  public closeMainMenu(): void {
    this.isMenuOpen.set(false);
  }

  public handleMenuZoneEnter(): void {
    this.openMenuZoneTimer = setTimeout(() => {
      if (!this.isMenuOpen()) {
        this.openMainMenu();
      }
    }, 300);
  }

  public handleMenuZoneLeave(): void {
    if (this.openMenuZoneTimer) {
      clearTimeout(this.openMenuZoneTimer);
      this.openMenuZoneTimer = undefined;
    }
  }

  public handleSwipeRight(element: HTMLElement): ClearSwipeHandlers {
    return detectSwipeRight(element, () => {
      if (!this.isMenuOpen()) {
        this.openMainMenu();
      }
    });
  }
}
