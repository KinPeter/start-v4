import { Component, Signal } from '@angular/core';
import { RandomBackgroundService } from './random-background.service';
import { NgIconComponent } from '@ng-icons/core';
import { PkIconButtonComponent } from '../../common/pk-icon-button.component';

@Component({
  selector: 'pk-random-background',
  imports: [NgIconComponent, PkIconButtonComponent],
  providers: [],
  styles: `
    .top-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 0.5rem;
      margin-bottom: 0.5rem;

      > ng-icon {
        font-size: 1.5rem;
        position: relative;
        top: -2px;

        &.enabled {
          color: var(--color-text-primary);
        }
      }

      .actions {
        display: flex;
        gap: 0.5rem;
      }
    }

    .bg-info {
      font-size: 0.85rem;
      padding: 0 0.5rem;
    }
  `,
  template: `
    <div class="top-row">
      <ng-icon name="tablerPhoto" [class.enabled]="randomBgEnabled()" />
      @if (randomBgEnabled()) {
        <div class="actions">
          <pk-icon-button
            tooltip="Load new image"
            variant="ghost"
            [accent]="true"
            [disabled]="isSmallScreen"
            (onClick)="loadNewBackground()">
            <ng-icon name="tablerRefresh" size="1.2rem" />
          </pk-icon-button>
          <pk-icon-button
            tooltip="Remove background"
            variant="ghost"
            [accent]="true"
            [disabled]="isSmallScreen"
            (onClick)="removeBackground()">
            <ng-icon name="tablerSquareX" size="1.2rem" />
          </pk-icon-button>
        </div>
      }
    </div>
    <div class="bg-info">
      @if (randomBgEnabled() && !isSmallScreen) {
        <p>Current image: {{ imageDescription() }}</p>
      } @else if (randomBgEnabled() && isSmallScreen) {
        <p>No background image on small screen</p>
      } @else {
        <p>Random background service is not available</p>
      }
    </div>
  `,
})
export class RandomBackgroundComponent {
  public randomBgEnabled: Signal<boolean>;
  public imageDescription: Signal<string | null>;
  public isSmallScreen = window.innerWidth < 430;

  constructor(private randomBackgroundService: RandomBackgroundService) {
    this.randomBgEnabled = this.randomBackgroundService.enabled;
    this.imageDescription = this.randomBackgroundService.description;
  }

  public loadNewBackground(): void {
    this.randomBackgroundService.getNewImage();
  }

  public removeBackground(): void {
    this.randomBackgroundService.removeBackground();
  }
}
