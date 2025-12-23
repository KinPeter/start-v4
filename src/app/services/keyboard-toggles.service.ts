import { Injectable, OnDestroy } from '@angular/core';
import { WidgetsBarService } from '../main/main-menu/widgets-bar.service';
import { MainMenuService } from '../main/main-menu/main-menu.service';
import { MainManagerService } from '../main/main-manager.service';

@Injectable({ providedIn: 'root' })
export class KeyboardTogglesService implements OnDestroy {
  constructor(
    private mainManagerService: MainManagerService,
    private mainMenuService: MainMenuService,
    private widgets: WidgetsBarService
  ) {
    this.initKeyListener();
  }

  private initKeyListener(): void {
    document.addEventListener('keyup', this.handleKeyUp);
  }

  private handleKeyUp = (event: KeyboardEvent): void => {
    const target = event.target as HTMLElement;
    if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
      this.toggleByKey(event.key);
    }
  };

  private toggleByKey(key: string): void {
    switch (key) {
      case 's':
      case 'k':
        this.mainManagerService.openSearch();
        break;
      case 'm':
        this.mainMenuService.toggleMainMenu();
        break;
      case 'n':
        this.widgets.toggleNotes();
        break;
      case 'a':
        this.widgets.toggleActivities();
        break;
      case 'p':
        this.widgets.togglePersonalData();
        break;
      case 'b':
        this.widgets.toggleBirthdays();
        break;
      case 'w':
        this.widgets.toggleWeather();
        break;
      case 't':
        this.widgets.toggleTranslator();
        break;
      case 'f':
        this.widgets.toggleFlights();
        break;
      case 'd':
        this.widgets.toggleDocs();
        break;
    }
  }

  public ngOnDestroy(): void {
    document.removeEventListener('keyup', this.handleKeyUp);
  }
}
