import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  Signal,
  signal,
  viewChild,
} from '@angular/core';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { RandomBackgroundService } from './main-menu/random-background.service';
import { ShortcutsComponent } from './shortcuts/shortcuts.component';
import { WidgetsBarService } from './main-menu/widgets-bar.service';
import { NotesComponent } from './notes/notes.component';
import { PersonalDataComponent } from './personal-data/personal-data.component';
import { BirthdaysComponent } from './birthdays/birthdays.component';
import { WeatherComponent } from './weather/weather.component';
import { ActivitiesComponent } from './activities/activities.component';
import { detectSwipeRight } from '../utils/swipe-handlers';

@Component({
  selector: 'pk-main',
  imports: [
    MainMenuComponent,
    ShortcutsComponent,
    NotesComponent,
    PersonalDataComponent,
    BirthdaysComponent,
    WeatherComponent,
    ActivitiesComponent,
  ],
  styles: `
    .main-content {
      width: 100%;
      height: calc(100vh - 60px);
      overflow-y: auto;
      padding: 0;
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;

      @media screen and (min-width: 430px) {
        padding: 1rem;
        height: 100vh;
      }
    }

    .open-menu-zone {
      width: 0;
      height: 65vh;
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
      height: 100%;
      max-height: 100vh;
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      gap: 1rem;

      .col {
        max-height: calc(100vh - 70px);
        display: flex;
        flex-direction: column;
        gap: 1rem;
        overflow-y: auto;
      }

      > div {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .col-1,
      .col-2 {
        flex-wrap: wrap;
      }

      .col-2,
      .col-3 {
        flex-wrap: wrap-reverse;
      }

      .col-x {
        flex-grow: 1;
      }
    }
  `,
  template: `
    <div class="main-content" [style.background-image]="imageUrl()" #mainContent>
      <div class="widgets">
        <div class="col col-1">
          @if (widgets.notesOpen()) {
            <pk-notes />
          }
        </div>
        <div class="col col-2">
          @if (widgets.activitiesOpen()) {
            <pk-activities />
          }
        </div>
        <div class="col col-x"></div>
        <div class="col col-3">
          @if (widgets.personalDataOpen()) {
            <pk-personal-data />
          }
        </div>
        <div class="col col-4">
          @if (widgets.weatherOpen()) {
            <pk-weather />
          }
          @if (widgets.birthdaysOpen()) {
            <pk-birthdays />
          }
        </div>
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
export class MainComponent implements AfterViewInit, OnDestroy {
  public mainMenuOpen = signal(false);
  public imageUrl: Signal<string | null>;
  public mainContent = viewChild.required<ElementRef<HTMLDivElement>>('mainContent');

  private openMenuZoneTimer: ReturnType<typeof setTimeout> | undefined;
  private clearSwipeHandlers: (() => void) | undefined;

  constructor(
    private randomBackgroundService: RandomBackgroundService,
    public widgets: WidgetsBarService
  ) {
    this.imageUrl = this.randomBackgroundService.imageUrl;
  }

  public ngAfterViewInit(): void {
    this.clearSwipeHandlers = detectSwipeRight(this.mainContent().nativeElement, () => {
      if (!this.mainMenuOpen()) {
        this.mainMenuOpen.set(true);
      }
    });
  }

  public ngOnDestroy(): void {
    this.clearSwipeHandlers?.();
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
