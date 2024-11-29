import { Component, input, output } from '@angular/core';
import { Shortcut } from '@kinpeter/pk-common';
import { SettingsStore } from '../settings/settings.store';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'pk-shortcut',
  imports: [NgOptimizedImage],
  providers: [],
  styles: `
    button.shortcut {
      border: none;
      background: none;
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 120px;
      height: 120px;

      &:hover {
        cursor: pointer;
        background-color: var(--color-bg-opaque-lighter);
        border-radius: 8px;
      }

      img {
        width: 48px;
        height: 48px;
      }

      p {
        margin: 0.65rem 0 0;
        color: var(--color-text-on-dark);
        text-align: center;
        max-width: 100%;
        white-space: pre-wrap;
        text-overflow: ellipsis;
        font-size: 1rem;
      }
    }
  `,
  template: `
    <button class="shortcut" (click)="onOpen()">
      <img [ngSrc]="iconUrl" width="48" height="48" [alt]="shortcut()?.name" />
      <p>{{ shortcut()?.name }}</p>
    </button>
  `,
})
export class ShortcutComponent {
  public shortcut = input<Shortcut>();

  public clicked = output<void>();

  constructor(private settingsStore: SettingsStore) {}

  public get iconUrl(): string {
    if (this.shortcut()?.iconUrl.startsWith('http')) {
      return this.shortcut()?.iconUrl ?? '';
    }
    return `${this.settingsStore.shortcutIconBaseUrl}${this.shortcut()?.iconUrl}`;
  }

  public onOpen(): void {
    this.clicked.emit();
    setTimeout(() => {
      window.open(this.shortcut()?.url, '_blank');
    });
  }
}
