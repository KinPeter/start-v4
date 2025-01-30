import { Component, Signal } from '@angular/core';
import { GlobalSearchResult, GlobalSearchService } from './global-search.service';
import { PersonalDataCardComponent } from '../personal-data/personal-data-card.component';

@Component({
  selector: 'pk-search-results',
  imports: [PersonalDataCardComponent],
  providers: [],
  styles: ``,
  template: `
    <div class="results">
      <div class="personal-data">
        @for (data of results().personalData; track data.id) {
          <pk-personal-data-card [data]="data" [hideActions]="true" />
        }
      </div>
    </div>
  `,
})
export class SearchResultsComponent {
  public results: Signal<GlobalSearchResult>;

  constructor(private globalSearchService: GlobalSearchService) {
    this.results = this.globalSearchService.results;
  }
}
