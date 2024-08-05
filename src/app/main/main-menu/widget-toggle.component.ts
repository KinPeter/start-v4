import { Component, computed, input, output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  tablerAlphabetKorean,
  tablerBike,
  tablerCalendar,
  tablerCreditCard,
  tablerNote,
  tablerTemperatureSun,
} from '@ng-icons/tabler-icons';

type Widgets = 'cycling' | 'notes' | 'weather' | 'birthdays' | 'korean' | 'personalData';

@Component({
  selector: 'pk-widget-toggle',
  standalone: true,
  imports: [NgIcon],
  providers: [
    provideIcons({
      tablerBike,
      tablerTemperatureSun,
      tablerAlphabetKorean,
      tablerNote,
      tablerCalendar,
      tablerCreditCard,
    }),
  ],
  styles: `
    button {
      border: none;
      outline: none;
      background: none;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-text-disabled);
      font-size: 1.5rem;
      padding: 0.5rem;
      cursor: pointer;
      border-radius: 50%;

      &:hover {
        color: var(--color-text);
      }

      &.open {
        color: var(--color-text-primary);
      }

      &:focus-visible {
        box-shadow: var(--focus-box-shadow);
      }
    }
  `,
  template: `
    <button type="button" [class.open]="open()" (click)="toggle.emit()">
      <ng-icon [name]="icon()" />
    </button>
  `,
})
export class WidgetToggleComponent {
  public open = input<boolean>(false);
  public widget = input<Widgets | undefined>();
  public toggle = output<void>();
  public icon = computed(() => {
    switch (this.widget()) {
      case 'birthdays':
        return 'tablerCalendar';
      case 'korean':
        return 'tablerAlphabetKorean';
      case 'notes':
        return 'tablerNote';
      case 'weather':
        return 'tablerTemperatureSun';
      case 'personalData':
        return 'tablerCreditCard';
      case 'cycling':
        return 'tablerBike';
      default:
        return undefined;
    }
  });
}
