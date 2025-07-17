import { Component, signal, Signal } from '@angular/core';
import { BirthdaysService } from './birthdays.service';
import { WidgetsBarService } from '../main-menu/widgets-bar.service';
import { NgIcon } from '@ng-icons/core';
import { PkIconButtonComponent } from '../../common/pk-icon-button.component';
import { PkWidgetDirective } from '../../common/pk-widget.directive';
import { PkLoaderComponent } from '../../common/pk-loader.component';
import { PkCardDirective } from '../../common/pk-card.directive';
import { FocusFirstDirective } from '../../common/focus-first.directive';
import { BirthdayItem } from '../../types';

@Component({
  selector: 'pk-birthdays',
  imports: [
    NgIcon,
    PkIconButtonComponent,
    PkWidgetDirective,
    PkLoaderComponent,
    PkCardDirective,
    FocusFirstDirective,
  ],
  providers: [],
  styles: `
    .container {
      min-height: 120px;
    }

    main .loader {
      margin-top: 5%;
    }

    .disabled {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      padding: 1rem 0;
    }

    button.show-upcoming {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.25rem 0;
    }

    .list {
      padding-left: 1rem;

      span {
        color: var(--color-text-disabled);
      }
    }

    .upcoming-card .list {
      margin-top: 0.25rem;
    }
  `,
  template: `
    <div pkWidget class="container">
      <header>
        <h1>Birthdays</h1>
        <div class="actions">
          <pk-icon-button tooltip="Refresh" (onClick)="refetch()" pkFocusFirst>
            <ng-icon name="tablerRefresh" size="1.2rem" />
          </pk-icon-button>
          <pk-icon-button tooltip="Close" (onClick)="close()">
            <ng-icon name="tablerX" size="1.2rem" />
          </pk-icon-button>
        </div>
      </header>
      <main>
        @if (loading()) {
          <div class="loader">
            <pk-loader size="sm" />
          </div>
        } @else if (disabled()) {
          <div class="disabled">
            <ng-icon name="tablerMoodSad" size="2rem" />
            <p>Birthdays service is not available.</p>
          </div>
        } @else {
          <div pkCard class="today-card">
            @if (!today().length) {
              <p>No birthdays today.</p>
            } @else {
              <h2>Birthdays today:</h2>
              <div class="list">
                @for (item of today(); track item.name) {
                  <p>{{ item.name }}</p>
                }
              </div>
            }
          </div>
          <div pkCard class="upcoming-card">
            @if (!upcoming().length) {
              <p>No upcoming birthdays.</p>
            } @else {
              <button
                type="button"
                class="show-upcoming"
                (click)="showUpcoming.set(!showUpcoming())">
                <b>Upcoming birthdays ({{ upcoming().length }})</b>
                <ng-icon
                  [name]="showUpcoming() ? 'tablerChevronUp' : 'tablerChevronDown'"
                  size="1rem" />
              </button>
              @if (showUpcoming()) {
                <div class="list">
                  @for (item of upcoming(); track item.name) {
                    <p>
                      {{ item.name }} <span>({{ item.date }})</span>
                    </p>
                  }
                </div>
              }
            }
          </div>
        }
      </main>
    </div>
  `,
})
export class BirthdaysComponent {
  public loading: Signal<boolean>;
  public disabled: Signal<boolean>;
  public today: Signal<BirthdayItem[]>;
  public upcoming: Signal<BirthdayItem[]>;
  public showUpcoming = signal(false);

  constructor(
    private birthdaysService: BirthdaysService,
    private widgetsBarService: WidgetsBarService
  ) {
    this.loading = this.birthdaysService.loading;
    this.disabled = this.birthdaysService.disabled;
    this.today = this.birthdaysService.today;
    this.upcoming = this.birthdaysService.upcoming;
  }

  public close(): void {
    this.widgetsBarService.toggleBirthdays();
  }

  public refetch(): void {
    this.birthdaysService.fetchBirthdays();
  }
}
