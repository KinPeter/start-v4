import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { NotificationService } from './notification.service';
import { parseError } from '../utils/parse-error';
import { DataBackup } from '@kinpeter/pk-common';
import { ApiRoutes } from '../constants/api-routes';

@Injectable({ providedIn: 'root' })
export class DataBackupService {
  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService
  ) {}

  public sendBackupEmailRequest(): void {
    this.notificationService.showSuccess('Request for data backup has been sent.');
    this.apiService.get(ApiRoutes.DATA_BACKUP_EMAIL).subscribe({
      next: () => {
        this.notificationService.showSuccess('Data backup email has been dispatched successfully!');
      },
      error: err => {
        this.notificationService.showError('Data backup failed. ' + parseError(err));
      },
    });
  }

  public getBackupData(): void {
    this.notificationService.showSuccess('Request for data backup has been sent.');
    this.apiService.get<DataBackup>(ApiRoutes.DATA_BACKUP).subscribe({
      next: (res: DataBackup) => {
        this.notificationService.showSuccess('Data backup fetched successfully!');
        this.downloadBackup(res);
      },
      error: err => {
        this.notificationService.showError('Data backup failed. ' + parseError(err));
      },
    });
  }

  private downloadBackup(content: DataBackup): void {
    const text = JSON.stringify(content, null, 2);
    const now = new Date();
    const date = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
    const filename = `pk-central-backup-${date}.json`;
    const type = 'text/plain';

    const blob = new Blob([text], { type });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    // Clean up after download
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }
}
