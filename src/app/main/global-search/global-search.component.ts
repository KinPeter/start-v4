import { Component, Signal } from '@angular/core';
import { GlobalSearchService } from './global-search.service';
import { MainManagerService } from '../main-manager.service';
import { ReactiveFormsModule } from '@angular/forms';
import { SearchBarComponent } from './search-bar.component';
import { SearchResultsComponent } from './search-results.component';

@Component({
  selector: 'pk-global-search',
  imports: [ReactiveFormsModule, SearchBarComponent, SearchResultsComponent],
  providers: [],
  styles: `
    .search-backdrop {
      position: absolute;
      top: 0;
      left: 0;
      height: 100vh;
      width: 100vw;
      background-color: var(--color-bg-opaque);
      backdrop-filter: blur(2px);
      z-index: var(--overlay-backdrop-z-index);
    }

    .search {
      position: absolute;
      z-index: var(--overlay-content-z-index);
      top: 10vh;
      height: 80vh;
      left: 0;
      width: 100%;
      overflow-y: auto;

      header {
        padding: 0 1rem;
      }

      @media (min-width: 1000px) {
        top: 20vh;
        height: 60vh;
        left: calc(100vw / 2 - 500px);
        width: 1000px;

        header {
          padding: 0 25%;
        }
      }
    }
  `,
  template: `
    @if (showSearch()) {
      <div
        class="search-backdrop"
        (click)="onClickBackdrop()"
        tabindex="0"
        (keyup)="onClickBackdrop()"></div>
      <div class="search">
        <header>
          <pk-search-bar />
        </header>
        <pk-search-results />
      </div>
    }
  `,
})
export class GlobalSearchComponent {
  public showSearch: Signal<boolean>;

  constructor(
    private globalSearchService: GlobalSearchService,
    private mainManagerService: MainManagerService
  ) {
    this.showSearch = this.mainManagerService.showSearch;
  }

  public onClickBackdrop(): void {
    this.mainManagerService.closeSearch();
    this.globalSearchService.clearResults();
  }
}
