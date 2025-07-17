import { Component, output, Signal, signal, WritableSignal } from '@angular/core';
import { ShortcutComponent } from './shortcut.component';
import { ShortcutsService } from './shortcuts.service';
import { ShortcutsMenuComponent } from './shortcuts-menu.component';
import { MainManagerService } from '../main-manager.service';
import { ShortcutCategory, ShortcutsByCategory } from '../../types';

@Component({
  selector: 'pk-shortcuts',
  imports: [ShortcutsMenuComponent, ShortcutComponent],
  providers: [],
  styles: `
    .shortcuts-backdrop {
      position: absolute;
      top: 0;
      left: 0;
      height: 100vh;
      width: 100vw;
      background-color: var(--color-bg-opaque);
      backdrop-filter: blur(2px);
      z-index: var(--overlay-backdrop-z-index);
    }

    .shortcuts {
      position: absolute;
      z-index: var(--overlay-content-z-index);
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      top: calc(100vh / 2 - 40vh);
      left: calc(100vw / 2 - 200px);
      max-width: 400px;
      max-height: 80vh;
      overflow-y: auto;

      @media (min-width: 800px) {
        top: calc(100vh / 2 - 190px);
        left: calc(100vw / 2 - 385px);
        max-width: 770px;
        max-height: 380px;
      }
    }
  `,
  template: `
    <pk-shortcuts-menu
      (clickMainMenu)="onClickMainMenu()"
      (clickSearch)="onClickSearch()"
      (clickMenu)="onClickMenu($event)"
      (enterMenu)="onEnterMenu($event)"
      (mouseLeave)="onMouseLeave()"></pk-shortcuts-menu>
    @if (showShortcuts()) {
      <div
        class="shortcuts-backdrop"
        (click)="onClickBackdrop()"
        tabindex="0"
        (keyup)="onClickBackdrop()"></div>
    }
    @if (showShortcuts() && shortcuts()) {
      <div class="shortcuts">
        @for (sc of shortcuts()[selectedCategory()]; track sc.id) {
          <pk-shortcut [shortcut]="sc" (clicked)="onClickBackdrop()" />
        }
      </div>
    }
  `,
})
export class ShortcutsComponent {
  public openMainMenu = output<void>();
  public mouseHover = signal(false);
  public selectedCategory: WritableSignal<ShortcutCategory> = signal(ShortcutCategory.TOP);
  public shortcuts: Signal<ShortcutsByCategory>;
  public showShortcuts: Signal<boolean>;

  constructor(
    private shortcutsService: ShortcutsService,
    private mainManagerService: MainManagerService
  ) {
    this.shortcuts = this.shortcutsService.shortcuts;
    this.showShortcuts = this.mainManagerService.showShortcuts;
  }

  public onClickMainMenu(): void {
    this.mainManagerService.closeShortcuts();
    this.mainManagerService.closeSearch();
    this.openMainMenu.emit();
  }

  public onClickSearch(): void {
    this.mainManagerService.openSearch();
  }

  public onClickMenu(category: ShortcutCategory): void {
    this.selectedCategory.set(category);
    this.mainManagerService.openShortcuts();
  }

  public onEnterMenu(category: ShortcutCategory): void {
    this.selectedCategory.set(category);
    this.onMouseEnter();
  }

  public onClickBackdrop(): void {
    this.mainManagerService.closeShortcuts();
  }

  public onMouseEnter(): void {
    this.mouseHover.set(true);
    setTimeout(() => {
      if (this.mouseHover()) {
        this.mainManagerService.openShortcuts();
      }
    }, 500);
  }

  public onMouseLeave(): void {
    this.mouseHover.set(false);
  }
}
