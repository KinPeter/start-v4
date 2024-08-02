import { computed, Injectable } from '@angular/core';
import { Store } from '../utils/store';

export enum MessageType {
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
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
  constructor() {
    super(initialState);
  }

  public notifications = computed(() => this.state().notifications);

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
}
