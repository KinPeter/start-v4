import { Component, input } from '@angular/core';
import { Flight } from '@kinpeter/pk-common';

@Component({
  selector: 'pk-upcoming-flights',
  imports: [],
  providers: [],
  styles: ``,
  template: ``,
})
export class UpcomingFlightsComponent {
  public flights = input.required<Flight[]>();
}
