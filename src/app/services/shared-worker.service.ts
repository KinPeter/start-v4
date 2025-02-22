import { Injectable } from '@angular/core';
import { AuthStore } from '../auth/auth.store';
import { NotificationService } from './notification.service';

const PK_CENTRAL_CONTEXT = 'PK-CENTRAL';
const START_V4 = 'START_V4';

@Injectable({ providedIn: 'root' })
export class SharedWorkerService {
  private worker: SharedWorker | null = null;

  constructor(
    private authStore: AuthStore,
    private notificationService: NotificationService
  ) {}

  public initiate(): void {
    try {
      this.worker = new SharedWorker('https://p-kin.com/pk-worker.js');
      this.worker.port.start();

      // Send a message to the shared worker
      this.worker.port.postMessage({
        context: PK_CENTRAL_CONTEXT,
        sender: START_V4,
        topic: 'welcome',
        payload: 'Hello from Start V4',
      });

      // Receive messages from the shared worker
      this.worker.port.onmessage = event => {
        console.log('Received message from shared worker:', event.data);
      };
    } catch (e) {
      this.notificationService.showError(
        (e as unknown as Error)?.message ?? 'Failed to construct SharedWorker'
      );
      console.log(e);
    }
  }

  public close(): void {
    if (this.worker) {
      this.worker.port.close();
    }
  }
}
