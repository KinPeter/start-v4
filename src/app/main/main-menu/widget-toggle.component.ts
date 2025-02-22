import { Component, computed, input, output } from '@angular/core';
import { NgIcon } from '@ng-icons/core';

type Widgets =
  | 'Activities'
  | 'Notes'
  | 'Weather'
  | 'Birthdays'
  | 'Translator'
  | 'Personal Data'
  | 'Flights';

@Component({
  selector: 'pk-widget-toggle',
  imports: [NgIcon],
  providers: [],
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
      position: relative;

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

    .badge {
      width: 15px;
      height: 15px;
      border-radius: 50%;
      background-color: var(--color-accent);
      color: var(--color-white);
      font-size: 0.7rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      bottom: 2px;
      right: 2px;
    }
  `,
  template: `
    <button
      type="button"
      [title]="widget()"
      [class.open]="open()"
      (click)="toggle.emit()"
      [id]="buttonId()">
      <ng-icon [name]="icon()" />
      @if (badgeCount()) {
        <div class="badge">{{ badgeCount() }}</div>
      }
    </button>
  `,
})
export class WidgetToggleComponent {
  public open = input<boolean>(false);
  public widget = input<Widgets | undefined>();
  public badgeCount = input<number | undefined>();
  public toggle = output<void>();
  public icon = computed(() => {
    switch (this.widget()) {
      case 'Birthdays':
        return 'tablerCalendar';
      case 'Translator':
        return 'tablerLanguage';
      case 'Notes':
        return 'tablerNote';
      case 'Weather':
        return 'tablerTemperatureSun';
      case 'Personal Data':
        return 'tablerCreditCard';
      case 'Activities':
        return 'tablerBike';
      case 'Flights':
        return 'tablerPlaneDeparture';
      default:
        return undefined;
    }
  });
  public buttonId = computed(() => {
    return `widget-toggle-${this.widget()?.toLocaleLowerCase().replace(/\s/g, '-')}`;
  });
}
