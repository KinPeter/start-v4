import { AfterViewInit, Component, ElementRef, OnDestroy, Signal, viewChild } from '@angular/core';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { RandomBackgroundService } from './main-menu/random-background.service';
import { ShortcutsComponent } from './shortcuts/shortcuts.component';
import { WidgetsBarService } from './main-menu/widgets-bar.service';
import { NotesComponent } from './notes/notes.component';
import { PersonalDataComponent } from './personal-data/personal-data.component';
import { BirthdaysComponent } from './birthdays/birthdays.component';
import { WeatherComponent } from './weather/weather.component';
import { ActivitiesComponent } from './activities/activities.component';
import { MainMenuService } from './main-menu/main-menu.service';
import { KeyboardTogglesService } from '../services/keyboard-toggles.service';

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

      @media screen and (min-width: 430px) {
        width: 1rem;
      }

      &:hover {
        background-color: var(--color-primary);
        opacity: 0.2;
      }
    }

    .widgets {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      flex-direction: column;
      flex-wrap: nowrap;
      gap: 1rem;

      @media screen and (min-width: 430px) {
        flex-direction: row;
        flex-wrap: wrap;
        height: 100%;
        max-height: 100vh;
      }

      .col {
        max-height: calc(100vh - 60px);
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
        display: none;

        @media screen and (min-width: 430px) {
          display: block;
          flex-grow: 1;
        }
      }

      .hidden {
        display: none;
      }
    }
  `,
  template: `
    <div class="main-content" [style.background-image]="imageUrl()" #mainContent>
      <div class="widgets">
        <div class="col col-1" [class.hidden]="!widgets.notesOpen()">
          @if (widgets.notesOpen()) {
            <pk-notes />
          }
        </div>
        <div class="col col-2" [class.hidden]="!widgets.activitiesOpen()">
          @if (widgets.activitiesOpen()) {
            <pk-activities />
          }
        </div>
        <div class="col col-x"></div>
        <div class="col col-3" [class.hidden]="!widgets.personalDataOpen()">
          @if (widgets.personalDataOpen()) {
            <pk-personal-data />
          }
        </div>
        <div class="col col-4" [class.hidden]="!widgets.weatherOpen() && !widgets.birthdaysOpen()">
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
      <pk-main-menu [open]="mainMenuOpen()" (onClose)="closeMainMenu()" />
      <pk-shortcuts (openMainMenu)="toggleMainMenu()" />
    </div>
  `,
})
export class MainComponent implements AfterViewInit, OnDestroy {
  public imageUrl: Signal<string | null>;
  public mainMenuOpen: Signal<boolean>;
  public mainContent = viewChild.required<ElementRef<HTMLDivElement>>('mainContent');

  private clearSwipeHandlers: (() => void) | undefined;

  constructor(
    private mainMenuService: MainMenuService,
    private _keyboardTogglesService: KeyboardTogglesService,
    private randomBackgroundService: RandomBackgroundService,
    public widgets: WidgetsBarService
  ) {
    this.imageUrl = this.randomBackgroundService.imageUrl;
    this.mainMenuOpen = this.mainMenuService.isMainMenuOpen;
  }

  public toggleMainMenu(): void {
    this.mainMenuService.toggleMainMenu();
  }

  public closeMainMenu(): void {
    this.mainMenuService.closeMainMenu();
  }

  public ngAfterViewInit(): void {
    this.clearSwipeHandlers = this.mainMenuService.handleSwipeRight(
      this.mainContent().nativeElement
    );
  }

  public ngOnDestroy(): void {
    this.clearSwipeHandlers?.();
  }

  public handleMenuZoneEnter(): void {
    this.mainMenuService.handleMenuZoneEnter();
  }

  public handleMenuZoneLeave(): void {
    this.mainMenuService.handleMenuZoneLeave();
  }
}
