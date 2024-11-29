import { Component, output, Signal } from '@angular/core';
import { ShortcutCategory } from '../../constants';
import { ShortcutsService } from './shortcuts.service';
import { PkLoaderComponent } from '../../common/pk-loader.component';
import { NgIcon } from '@ng-icons/core';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'pk-shortcuts-menu',
  imports: [PkLoaderComponent, NgIcon],
  providers: [],
  styles: `
    .shortcuts-menu {
      width: 320px;
      height: 52px;
      position: absolute;
      bottom: 0;
      left: calc(100vw / 2 - 320px / 2);
      background-color: var(--color-bg);
      padding: 0.5rem 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      border-top-left-radius: 16px;
      border-top-right-radius: 16px;
      z-index: var(--shortcuts-z-index);

      &.behind {
        z-index: var(--backdrop-z-index);
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
      @if (loading()) {
        <pk-loader size="sm" />
      } @else {
        <button
          (click)="clickMenu.emit(category.TOP)"
          (mouseenter)="enterMenu.emit(category.TOP)"
          (mouseleave)="mouseLeave.emit()">
          <ng-icon name="tablerStar" />
        </button>
        <button
          (click)="clickMenu.emit(category.CODING)"
          (mouseenter)="enterMenu.emit(category.CODING)"
          (mouseleave)="mouseLeave.emit()">
          <ng-icon name="tablerCode" />
        </button>
        <button
          (click)="clickMenu.emit(category.GOOGLE)"
          (mouseenter)="enterMenu.emit(category.GOOGLE)"
          (mouseleave)="mouseLeave.emit()">
          <ng-icon name="tablerBrandGoogle" />
        </button>
        <button
          (click)="clickMenu.emit(category.CYCLING)"
          (mouseenter)="enterMenu.emit(category.CYCLING)"
          (mouseleave)="mouseLeave.emit()">
          <ng-icon name="tablerBike" />
        </button>
        <button
          (click)="clickMenu.emit(category.FUN)"
          (mouseenter)="enterMenu.emit(category.FUN)"
          (mouseleave)="mouseLeave.emit()">
          <ng-icon name="tablerMoodSmileBeam" />
        </button>
        <button
          (click)="clickMenu.emit(category.OTHERS)"
          (mouseenter)="enterMenu.emit(category.OTHERS)"
          (mouseleave)="mouseLeave.emit()">
          <ng-icon name="tablerDots" />
        </button>
      }
    </div>
  `,
})
export class ShortcutsMenuComponent {
  public mouseLeave = output<void>();
  public clickMainMenu = output<void>();
  public clickMenu = output<ShortcutCategory>();
  public enterMenu = output<ShortcutCategory>();

  public category = ShortcutCategory;
  public loading: Signal<boolean>;
  public notificationPanelOpen: Signal<boolean>;

  constructor(
    private shortcutsService: ShortcutsService,
    private notificationService: NotificationService
  ) {
    this.loading = this.shortcutsService.loading;
    this.notificationPanelOpen = this.notificationService.isLogOpen;
  }
}
