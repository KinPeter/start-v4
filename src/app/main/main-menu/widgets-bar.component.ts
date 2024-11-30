import { Component, Signal } from '@angular/core';
import { WidgetsBarService } from './widgets-bar.service';
import { WidgetToggleComponent } from './widget-toggle.component';
import { BirthdaysService } from '../birthdays/birthdays.service';

@Component({
  selector: 'pk-widgets-bar',
  imports: [WidgetToggleComponent],
  providers: [],
  styles: `
    .widgets {
      display: flex;
      align-items: center;
    }
  `,
  template: `
    <div class="widgets">
      <pk-widget-toggle
        widget="Notes"
        [open]="service.notesOpen()"
        (toggle)="service.toggleNotes()" />
      <pk-widget-toggle
        widget="Cycling"
        [open]="service.cyclingOpen()"
        (toggle)="service.toggleCycling()" />
      <pk-widget-toggle
        widget="Personal Data"
        [open]="service.personalDataOpen()"
        (toggle)="service.togglePersonalData()" />
      <pk-widget-toggle
        widget="Birthdays"
        [open]="service.birthdaysOpen()"
        [badgeCount]="birthdayCount()"
        (toggle)="service.toggleBirthdays()" />
      <pk-widget-toggle
        widget="Korean"
        [open]="service.koreanOpen()"
        (toggle)="service.toggleKorean()" />
      <pk-widget-toggle
        widget="Weather"
        [open]="service.weatherOpen()"
        (toggle)="service.toggleWeather()" />
    </div>
  `,
})
export class WidgetsBarComponent {
  public birthdayCount: Signal<number | undefined>;

  constructor(
    public service: WidgetsBarService,
    private birthdaysService: BirthdaysService
  ) {
    this.birthdayCount = this.birthdaysService.hasBirthdaysToday;
  }
}
