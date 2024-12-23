import { Component, effect, signal, Signal } from '@angular/core';
import { MessageType, Notification, NotificationService } from '../services/notification.service';
import { NgIconComponent } from '@ng-icons/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'pk-notification-log',
  imports: [NgIconComponent, DatePipe],
  providers: [],
  styles: `
    .container {
      font-family: monospace;
      position: fixed;
      bottom: -30vh;
      left: 0;
      z-index: var(--notification-log-z-index);
      transition: bottom 0.3s ease-in-out;

      &.open {
        bottom: 0;
      }
    }

    .top-row,
    .log-container {
      background-color: var(--color-bg-darker);
    }

    .top-row {
      display: inline-flex;
      align-items: center;
      border-top-right-radius: 0.5rem;
      padding: 0.2rem;

      > span {
        display: flex;
        align-items: center;
      }

      .last-message {
        padding-right: 0.5rem;
      }

      button {
        cursor: pointer;
        background: none;
        outline: none;
        border: none;
        padding: 0.3rem;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--color-text);
      }
    }

    .log-container {
      width: 100vw;
      height: 30vh;
      padding: 0.4rem;
      overflow-y: auto;

      p {
        margin: 0;
      }
    }

    .error {
      color: var(--color-error);
    }

    .warning {
      color: var(--color-warning);
    }

    .success {
      color: var(--color-success);
    }

    .info {
      color: var(--color-info);
    }
  `,
  template: `
    <div class="container" [class.open]="open()">
      <div class="top-row">
        @if (open()) {
          <button (click)="togglePanel()">
            <ng-icon name="tablerChevronDown" />
          </button>
        } @else {
          <button (click)="togglePanel()">
            <ng-icon name="tablerChevronUp" />
          </button>
        }
        @if (lastDisplayed()) {
          <span>
            <button (click)="hideLastNotification()">
              <ng-icon name="tablerX" />
            </button>
            <span class="last-message" [class]="lastDisplayed()?.type">
              {{ lastDisplayed()?.message }}
            </span>
          </span>
        }
      </div>
      <div class="log-container">
        @for (item of notifications(); let idx = $index; track idx) {
          <p [class]="item.type">[{{ item.date | date: 'mediumTime' }}]: {{ item.message }}</p>
        }
      </div>
    </div>
  `,
})
export class NotificationLogComponent {
  public notifications: Signal<Notification[]> = signal([]);
  public lastDisplayed = signal<Notification | null>(null);
  public open: Signal<boolean>;

  private hideTimer: ReturnType<typeof setTimeout> | undefined;

  constructor(private notificationService: NotificationService) {
    this.notifications = this.notificationService.notifications;
    this.open = this.notificationService.isLogOpen;

    effect(() => this.handleLastNotification(this.notifications()));
  }

  public togglePanel(): void {
    if (this.open()) {
      this.notificationService.closeLogPanel();
    } else {
      this.notificationService.openLogPanel();
    }
  }

  public hideLastNotification(): void {
    this.lastDisplayed.set(null);
  }

  private handleLastNotification(notifications: Notification[]): void {
    if (!notifications.length) return;
    const last = notifications[0];
    if (last.type === MessageType.LOG) return;
    this.lastDisplayed.set(last);
    if (last.type === MessageType.SUCCESS || last.type === MessageType.INFO) {
      if (this.hideTimer) {
        clearTimeout(this.hideTimer);
      }
      this.hideTimer = setTimeout(() => {
        this.hideLastNotification();
      }, 3000);
    }
  }
}
