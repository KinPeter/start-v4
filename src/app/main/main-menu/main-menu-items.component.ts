import { Component, output } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { DataBackupService } from '../../services/data-backup.service';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  tablerBrandWindows,
  tablerCloudDown,
  tablerCloudDownload,
  tablerLogout,
  tablerSettingsCode,
} from '@ng-icons/tabler-icons';

@Component({
  selector: 'pk-main-menu-items',
  standalone: true,
  imports: [NgIconComponent],
  providers: [
    provideIcons({
      tablerLogout,
      tablerCloudDown,
      tablerCloudDownload,
      tablerBrandWindows,
      tablerSettingsCode,
    }),
  ],
  styles: `
    button {
      display: flex;
      align-items: center;
      padding: 1rem 0.75rem;
      gap: 0.75rem;
      width: 100%;
      border-radius: var(--radius-default);

      &:hover {
        background-color: var(--color-bg-opaque-lighter);
      }

      ng-icon {
        position: relative;
        top: -1px;
      }
    }
  `,
  template: `
    <div class="container">
      @for (item of items; track item.label) {
        <button type="button" (click)="item.action()">
          <ng-icon [name]="item.icon" size="1.2rem" />
          <span>{{ item.label }}</span>
        </button>
      }
    </div>
  `,
})
export class MainMenuItemsComponent {
  public openSettings = output<void>();
  public openShortcuts = output<void>();

  constructor(
    private authService: AuthService,
    private dataBackupService: DataBackupService
  ) {}

  public items = [
    { icon: 'tablerSettingsCode', label: 'Settings', action: () => this.openSettings.emit() },
    {
      icon: 'tablerBrandWindows',
      label: 'Shortcut tiles',
      action: () => this.openShortcuts.emit(),
    },
    {
      icon: 'tablerCloudDown',
      label: 'Email data backup',
      action: () => this.dataBackupService.sendBackupEmailRequest(),
    },
    {
      icon: 'tablerCloudDownload',
      label: 'Download data backup',
      action: () => this.dataBackupService.getBackupData(),
    },
    {
      icon: 'tablerLogout',
      label: 'Log out',
      action: () => {
        this.authService.logout();
        location.reload();
      },
    },
  ];
}
