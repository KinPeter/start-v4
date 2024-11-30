import { Component, Signal, signal } from '@angular/core';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { RandomBackgroundService } from './main-menu/random-background.service';
import { ShortcutsComponent } from './shortcuts/shortcuts.component';
import { WidgetsBarService } from './main-menu/widgets-bar.service';
import { NotesComponent } from './notes/notes.component';
import { PersonalDataComponent } from './personal-data/personal-data.component';

@Component({
  selector: 'pk-main',
  imports: [MainMenuComponent, ShortcutsComponent, NotesComponent, PersonalDataComponent],
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

    .widgets {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  `,
  template: `
    <div class="main-content" [style.background-image]="imageUrl()">
      <div class="widgets">
        @if (widgets.notesOpen()) {
          <pk-notes />
        }
        @if (widgets.personalDataOpen()) {
          <pk-personal-data />
        }
      </div>
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

  constructor(
    private randomBackgroundService: RandomBackgroundService,
    public widgets: WidgetsBarService
  ) {
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
