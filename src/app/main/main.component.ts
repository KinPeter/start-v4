import { Component, Signal, signal } from '@angular/core';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { RandomBackgroundService } from './main-menu/random-background.service';
import { ShortcutsComponent } from './shortcuts/shortcuts.component';
import { WidgetsBarService } from './main-menu/widgets-bar.service';
import { NotesComponent } from './notes/notes.component';
import { PersonalDataComponent } from './personal-data/personal-data.component';
import { BirthdaysComponent } from './birthdays/birthdays.component';

@Component({
  selector: 'pk-main',
  imports: [
    MainMenuComponent,
    ShortcutsComponent,
    NotesComponent,
    PersonalDataComponent,
    BirthdaysComponent,
  ],
  styles: `
    .main-content {
      width: 100%;
      height: calc(100vh - 60px);
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 1rem;
      overflow-y: auto;
      padding: 0;
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;

      @media screen and (min-width: 420px) {
        padding: 1rem;
        height: 100vh;
      }
    }

    .open-menu-zone {
      width: 0;
      height: 100vh;
      position: fixed;
      top: 0;
      left: 0;

      @media screen and (min-width: 420px) {
        width: 1rem;
      }

      &:hover {
        background-color: var(--color-primary);
        opacity: 0.2;
      }
    }

    .widgets {
      width: 100%;
      max-height: 100vh;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 1rem;

      > div {
        max-height: calc(100vh - 70px);
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
    }
  `,
  template: `
    <div class="main-content" [style.background-image]="imageUrl()">
      <div class="widgets">
        @if (widgets.notesOpen()) {
          <div class="left">
            @if (widgets.notesOpen()) {
              <pk-notes />
            }
          </div>
        }
        @if (widgets.personalDataOpen() || widgets.birthdaysOpen()) {
          <div class="right">
            @if (widgets.personalDataOpen()) {
              <pk-personal-data />
            }
            @if (widgets.birthdaysOpen()) {
              <pk-birthdays />
            }
          </div>
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
