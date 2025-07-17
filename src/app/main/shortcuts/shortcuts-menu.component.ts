import { Component, output, Signal } from '@angular/core';
import { ShortcutsService } from './shortcuts.service';
import { PkLoaderComponent } from '../../common/pk-loader.component';
import { NgIcon } from '@ng-icons/core';
import { NotificationService } from '../../services/notification.service';
import { ShortcutCategory } from '../../types';

@Component({
  selector: 'pk-shortcuts-menu',
  imports: [PkLoaderComponent, NgIcon],
  providers: [],
  styles: `
    .shortcuts-menu {
      width: 180px;
      height: 52px;
      position: fixed;
      bottom: 0;
      left: calc(100vw / 2 - 180px / 2);
      background-color: var(--color-bg);
      padding: 0.5rem 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      border-top-left-radius: 16px;
      border-top-right-radius: 16px;
      z-index: var(--overlay-content-z-index);

      @media screen and (min-width: 800px) {
        width: 360px;
        left: calc(100vw / 2 - 360px / 2);
      }

      &.behind {
        z-index: var(--backdrop-z-index);
      }

      .shortcut-buttons {
        display: none;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;

        @media screen and (min-width: 800px) {
          display: flex;
        }
      }

      .maximize-button {
        display: inline-block;

        @media screen and (min-width: 800px) {
          display: none;
        }
      }

      button {
        border: none;
        background: none;
        color: var(--color-text);
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;

        &:hover {
          color: var(--color-primary);
          cursor: pointer;
        }

        ng-icon {
          font-size: 32px;
        }
      }
    }
  `,
  template: `
    <div class="shortcuts-menu" [class.behind]="notificationPanelOpen()">
      <button (click)="clickMainMenu.emit()"><ng-icon name="tablerBrandWindows" /></button>
      <button (click)="clickSearch.emit()"><ng-icon name="tablerSearch" /></button>
      @if (loading()) {
        <pk-loader size="sm" />
      } @else {
        <div class="shortcut-buttons">
          @for (button of shortcutButtons; track button.category) {
            <button
              (click)="clickMenu.emit(button.category)"
              (mouseenter)="enterMenu.emit(button.category)"
              (mouseleave)="mouseLeave.emit()">
              <ng-icon [name]="button.icon" />
            </button>
          }
        </div>
        <button class="maximize-button" (click)="enterFullScreen()">
          <ng-icon name="tablerArrowsMaximize" />
        </button>
      }
    </div>
  `,
})
export class ShortcutsMenuComponent {
  public mouseLeave = output<void>();
  public clickMainMenu = output<void>();
  public clickSearch = output<void>();
  public clickMenu = output<ShortcutCategory>();
  public enterMenu = output<ShortcutCategory>();

  public loading: Signal<boolean>;
  public notificationPanelOpen: Signal<boolean>;

  constructor(
    private shortcutsService: ShortcutsService,
    private notificationService: NotificationService
  ) {
    this.loading = this.shortcutsService.loading;
    this.notificationPanelOpen = this.notificationService.isLogOpen;
  }

  public shortcutButtons = [
    { category: ShortcutCategory.TOP, icon: 'tablerStar' },
    { category: ShortcutCategory.CODING, icon: 'tablerCode' },
    { category: ShortcutCategory.GOOGLE, icon: 'tablerBrandGoogle' },
    { category: ShortcutCategory.HOBBIES, icon: 'tablerBike' },
    { category: ShortcutCategory.FUN, icon: 'tablerMoodSmileBeam' },
    { category: ShortcutCategory.OTHERS, icon: 'tablerDots' },
  ];

  public enterFullScreen(): void {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    }
  }
}
