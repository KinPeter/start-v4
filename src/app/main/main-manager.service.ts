import { computed, Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MainManagerService {
  private isShortcutsOpen = signal(false);
  private isSearchOpen = signal(false);

  public showShortcuts = computed(() => this.isShortcutsOpen());
  public showSearch = computed(() => this.isSearchOpen());

  public openShortcuts(): void {
    this.isSearchOpen.set(false);
    this.isShortcutsOpen.set(true);
  }

  public closeShortcuts(): void {
    this.isShortcutsOpen.set(false);
  }

  public openSearch(): void {
    this.isShortcutsOpen.set(false);
    this.isSearchOpen.set(true);
  }

  public closeSearch(): void {
    this.isSearchOpen.set(false);
  }
}
