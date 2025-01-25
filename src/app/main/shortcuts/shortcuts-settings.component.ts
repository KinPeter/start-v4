import { Component, computed, effect, output, Signal, signal } from '@angular/core';
import { PkInputComponent } from '../../common/pk-input.component';
import { PkInputDirective } from '../../common/pk-input.directive';
import { ReactiveFormsModule } from '@angular/forms';
import { ShortcutsFormComponent } from './shortcuts-form.component';
import { Shortcut, ShortcutCategory, ShortcutRequest, UUID } from '@kinpeter/pk-common';
import { ShortcutsService } from './shortcuts.service';
import { PkIconButtonComponent } from '../../common/pk-icon-button.component';
import { NgIcon } from '@ng-icons/core';
import { NgOptimizedImage } from '@angular/common';
import { SettingsStore } from '../settings/settings.store';
import { NotificationService } from '../../services/notification.service';
import { PkLoaderComponent } from '../../common/pk-loader.component';

@Component({
  selector: 'pk-shortcuts-settings',
  imports: [
    PkInputComponent,
    PkInputDirective,
    ReactiveFormsModule,
    ShortcutsFormComponent,
    PkIconButtonComponent,
    NgIcon,
    NgOptimizedImage,
    PkLoaderComponent,
  ],
  providers: [],
  styles: `
    header {
      display: flex;
      align-items: center;
      gap: 1rem;

      pk-icon-button {
        position: relative;
        top: 2px;
      }
    }

    main {
      margin-bottom: 50px;
    }

    .list-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid var(--color-border);
      padding: 0.25rem;

      .left {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 0.5rem;
        cursor: pointer;

        ng-icon {
          display: none;
        }

        &:hover {
          ng-icon {
            display: inline-block;
          }
        }
      }

      .right {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 0.25rem;
      }
    }
  `,
  template: `
    <div class="container">
      @if (formOpen()) {
        <pk-shortcuts-form
          [loading]="loading()"
          [data]="shortcutToEdit()"
          (cancel)="closeForm()"
          (save)="saveShortcut($event)" />
        <hr />
      }
      <header>
        <pk-input label="Category" width="150px" type="select">
          <select
            pkInput
            name="category"
            [value]="selectedCategory()"
            (change)="onSelectCategory($event)">
            @for (item of categories; track item) {
              <option [value]="item">{{ item }}</option>
            }
          </select>
        </pk-input>
        <pk-icon-button
          tooltip="New shortcut"
          variant="outline"
          [disabled]="formOpen() || loading()"
          (onClick)="formOpen.set(true)">
          <ng-icon name="tablerPlus" size="1.5rem" />
        </pk-icon-button>
        @if (loading()) {
          <pk-loader size="sm" />
        }
      </header>
      <main>
        <div class="shortcut-list">
          @for (item of shortcutsList(); track item.id) {
            <div class="list-item">
              <div class="left" tabindex="0" role="button" (click)="open(item.url)">
                <img [ngSrc]="item.iconUrl" width="24" height="24" [alt]="item.name" />
                <span>{{ item.name }}</span>
                <ng-icon name="tablerExternalLink" size="1rem" />
              </div>
              <div class="right">
                @if (shortcutToDelete()?.id !== item.id) {
                  <pk-icon-button
                    variant="default"
                    tooltip="Open"
                    [disabled]="formOpen() || loading()"
                    (onClick)="open(item.url)">
                    <ng-icon name="tablerExternalLink" size="1rem" />
                  </pk-icon-button>
                  <pk-icon-button
                    variant="default"
                    tooltip="Edit"
                    [disabled]="formOpen() || loading()"
                    (onClick)="selectForEdit(item.id)">
                    <ng-icon name="tablerEdit" size="1rem" />
                  </pk-icon-button>
                  <pk-icon-button
                    variant="default"
                    tooltip="Delete"
                    [disabled]="formOpen() || loading()"
                    (onClick)="selectForDelete(item.id)">
                    <ng-icon name="tablerTrash" size="1rem" />
                  </pk-icon-button>
                } @else {
                  <pk-icon-button
                    variant="outline"
                    tooltip="Cancel delete"
                    [disabled]="loading()"
                    (onClick)="cancelDelete()">
                    <ng-icon name="tablerX" size="1rem" />
                  </pk-icon-button>
                  <pk-icon-button
                    variant="filled"
                    tooltip="Confirm delete"
                    [disabled]="loading()"
                    (onClick)="confirmDelete(item.id)">
                    <ng-icon name="tablerCheck" size="1rem" />
                  </pk-icon-button>
                }
              </div>
            </div>
          }
        </div>
      </main>
    </div>
  `,
})
export class ShortcutsSettingsComponent {
  public done = output();
  public loading: Signal<boolean>;
  public formOpen = signal(false);
  public selectedCategory = signal<ShortcutCategory>(ShortcutCategory.TOP);
  public shortcuts = signal<Shortcut[]>([]);
  public shortcutToEdit = signal<Shortcut | null>(null);
  public shortcutToDelete = signal<Shortcut | null>(null);
  public categories = Object.values(ShortcutCategory);

  constructor(
    private shortcutsService: ShortcutsService,
    private settingsStore: SettingsStore,
    private notificationService: NotificationService
  ) {
    effect(() => {
      this.shortcuts.set(this.shortcutsService.shortcuts()[this.selectedCategory()]);
    });
    this.loading = this.shortcutsService.loading;
  }

  public shortcutsList = computed(() => {
    return this.shortcuts().map(shortcut => ({
      ...shortcut,
      iconUrl: this.getIconUrl(shortcut),
    }));
  });

  public saveShortcut(data: ShortcutRequest): void {
    if (!this.shortcutToEdit()) {
      this.shortcutsService.createShortcut(this.transformData(data)).subscribe({
        next: () => {
          this.notificationService.showSuccess('Shortcut has been created');
          this.shortcutsService.fetchShortcuts();
          this.closeForm();
        },
        error: () => this.notificationService.showError('Failed to create shortcut'),
      });
    } else {
      this.shortcutsService
        .updateShortcut(this.transformData(data), this.shortcutToEdit()!.id)
        .subscribe({
          next: () => {
            this.notificationService.showSuccess('Shortcut has been updated');
            this.shortcutsService.fetchShortcuts();
            this.closeForm();
          },
          error: () => this.notificationService.showError('Failed to update shortcut'),
        });
    }
  }

  public closeForm(): void {
    this.formOpen.set(false);
    this.shortcutToEdit.set(null);
  }

  public onSelectCategory(event: Event): void {
    const category = (event.target as HTMLSelectElement).value as ShortcutCategory;
    this.selectedCategory.set(category);
    this.shortcuts.set(this.shortcutsService.shortcuts()[category]);
  }

  public open(url: string): void {
    window.open(url, '_blank');
  }

  public selectForEdit(id: UUID): void {
    this.shortcutToEdit.set(this.shortcutsService.getById(id));
    this.formOpen.set(true);
  }

  public selectForDelete(id: UUID): void {
    this.shortcutToDelete.set(this.shortcutsService.getById(id));
  }

  public cancelDelete(): void {
    this.shortcutToDelete.set(null);
  }

  public confirmDelete(id: UUID): void {
    this.shortcutsService.deleteShortcut(id).subscribe({
      next: () => {
        this.notificationService.showSuccess('Shortcut has been deleted');
        this.shortcutsService.fetchShortcuts();
        this.shortcutToDelete.set(null);
      },
      error: () => this.notificationService.showError('Failed to delete shortcut'),
    });
  }

  private getIconUrl(shortcut: Shortcut): string {
    if (shortcut.iconUrl.startsWith('http')) {
      return shortcut.iconUrl;
    }
    return `${this.settingsStore.shortcutIconBaseUrl}${shortcut.iconUrl}`;
  }

  private transformData(data: ShortcutRequest): ShortcutRequest {
    return {
      ...data,
      priority: Number(data.priority),
    };
  }
}
