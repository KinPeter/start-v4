import { Component, output } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { DataBackupService } from '../../services/data-backup.service';
import { NgIconComponent } from '@ng-icons/core';

@Component({
  selector: 'pk-main-menu-items',
  imports: [NgIconComponent],
  providers: [],
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
    // {
    //   icon: 'tablerCloudDownload',
    //   label: 'Download data backup',
    //   action: () => this.dataBackupService.getBackupData(),
    // },
    {
      icon: 'tablerArrowsMaximize',
      label: 'Enter fullscreen',
      action: () => this.enterFullScreen(),
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

  private enterFullScreen(): void {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    }
  }
}
