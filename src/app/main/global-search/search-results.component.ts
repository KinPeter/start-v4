import { AfterViewInit, Component, ElementRef, OnDestroy, Signal, viewChild } from '@angular/core';
import { GlobalSearchResult, GlobalSearchService } from './global-search.service';
import { PersonalDataCardComponent } from '../personal-data/personal-data-card.component';
import { NoteComponent } from '../notes/note.component';
import { ShortcutComponent } from '../shortcuts/shortcut.component';
import { MainManagerService } from '../main-manager.service';

@Component({
  selector: 'pk-search-results',
  imports: [PersonalDataCardComponent, NoteComponent, ShortcutComponent],
  providers: [],
  styles: `
    .results {
      padding: 2px;
      display: flex;
      flex-direction: column;
      gap: 1rem;

      .shortcuts {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        justify-content: center;
        align-content: flex-start;
      }

      @media (min-width: 1000px) {
        flex-direction: row;
        justify-content: center;
        margin-top: 2rem;

        > div {
          flex-basis: 33%;
        }
      }

      > div.hidden {
        display: none;
      }
    }
  `,
  template: `
    <div class="results" #wrapper>
      <div class="shortcuts" [class.hidden]="!results().shortcuts.length">
        @for (shortcut of results().shortcuts; track shortcut.id) {
          <pk-shortcut [shortcut]="shortcut" />
        }
      </div>
      <div class="notes" [class.hidden]="!results().notes.length">
        @for (note of results().notes; track note.id) {
          <pk-note [note]="note" [hideActions]="true" />
        }
      </div>
      <div class="personal-data" [class.hidden]="!results().personalData.length">
        @for (data of results().personalData; track data.id) {
          <pk-personal-data-card [data]="data" [hideActions]="true" />
        }
      </div>
    </div>
  `,
})
export class SearchResultsComponent implements AfterViewInit, OnDestroy {
  public results: Signal<GlobalSearchResult>;
  public wrapper = viewChild.required<ElementRef<HTMLInputElement>>('wrapper');

  constructor(
    private globalSearchService: GlobalSearchService,
    private mainManagerService: MainManagerService
  ) {
    this.results = this.globalSearchService.results;
  }

  public ngAfterViewInit(): void {
    this.wrapper().nativeElement.focus();
    this.wrapper().nativeElement.addEventListener('keyup', this.keyUpHandler.bind(this));
  }

  public ngOnDestroy(): void {
    this.wrapper().nativeElement.removeEventListener('keyup', this.keyUpHandler.bind(this));
  }

  private keyUpHandler(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.mainManagerService.closeSearch();
      this.globalSearchService.clearResults();
    }
  }
}
