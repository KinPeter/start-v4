import { Component } from '@angular/core';

@Component({
  selector: 'pk-menu-weather',
  standalone: true,
  imports: [],
  providers: [],
  styles: `
    :host {
      padding: 1rem 0.5rem;
    }
  `,
  template: ` <small>--- weather comes here --- </small> `,
})
export class MenuWeatherComponent {}
