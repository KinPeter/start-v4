import { Component } from '@angular/core';
import { PkButtonComponent } from '../../common/pk-button.component';
import { NgIcon } from '@ng-icons/core';
import { StravaRoutesService } from './strava-routes.service';

@Component({
  selector: 'pk-strava-routes-link',
  imports: [PkButtonComponent, NgIcon],
  styles: ``,
  template: `
    <pk-button variant="subtle" [iconPrefix]="true" (click)="openStravaRoutes()">
      <ng-icon name="tablerExternalLink" size="1rem" />
      View Strava Routes
    </pk-button>
  `,
})
export class StravaRoutesLinkComponent {
  constructor(private stravaRoutesService: StravaRoutesService) {}

  public openStravaRoutes(): void {
    this.stravaRoutesService.openStravaRoutes();
  }
}
