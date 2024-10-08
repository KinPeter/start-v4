import { computed, Injectable, signal } from '@angular/core';
import { Store } from '../utils/store';

export enum MessageType {
  ERROR = 'error',
  SUCCESS = 'success',
  WARNING = 'warning',
  INFO = 'info',
  LOG = 'log',
}

export interface Notification {
  type: MessageType;
  message: string;
  date: Date;
}

interface NotificationState {
  notifications: Notification[];
}

const initialState: NotificationState = {
  notifications: [],
};

@Injectable({ providedIn: 'root' })
export class NotificationService extends Store<NotificationState> {
  private logOpen = signal<boolean>(false);

  constructor() {
    super(initialState);
  }

  public notifications = computed(() => this.state().notifications);
  public isLogOpen = computed(() => this.logOpen());

  public clearState(): void {
    this.setState({
      notifications: [],
    });
  }

  public showError(message: string): void {
    this.setState({
      notifications: [
        {
          type: MessageType.ERROR,
          date: new Date(),
          message,
        },
        ...this.state().notifications,
      ],
    });
  }

  public showWarning(message: string): void {
    this.setState({
      notifications: [
        {
          type: MessageType.WARNING,
          date: new Date(),
          message,
        },
        ...this.state().notifications,
      ],
    });
  }

  public showSuccess(message: string): void {
    this.setState({
      notifications: [
        {
          type: MessageType.SUCCESS,
          date: new Date(),
          message,
        },
        ...this.state().notifications,
      ],
    });
  }

  public showInfo(message: string): void {
    this.setState({
      notifications: [
        {
          type: MessageType.INFO,
          date: new Date(),
          message,
        },
        ...this.state().notifications,
      ],
    });
  }

  public showLog(message: string): void {
    this.setState({
      notifications: [
        {
          type: MessageType.LOG,
          date: new Date(),
          message,
        },
        ...this.state().notifications,
      ],
    });
  }

  public openLogPanel(): void {
    this.logOpen.set(true);
  }

  public closeLogPanel(): void {
    this.logOpen.set(false);
  }
}
