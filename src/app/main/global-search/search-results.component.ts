import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  OnDestroy,
  Signal,
  viewChild,
} from '@angular/core';
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
    .wrapper {
      padding: 2px;
    }

    .main-results {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin: 1rem 0;

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
        margin: 2rem 0 1rem;
        max-height: calc(60vh - 140px);
        overflow-y: auto;

        > div {
          flex-basis: 33%;
        }
      }

      > div.hidden {
        display: none;
      }
    }

    .birthday-results {
      text-align: center;
    }
  `,
  template: `
    <div class="wrapper" #wrapper>
      <div class="main-results">
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
      @if (results().birthdays.length) {
        <div class="birthday-results">
          <p>
            <b>Birthdays: </b>
            {{ birthdayResults() }}
          </p>
        </div>
      }
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

  public birthdayResults = computed(() =>
    this.results()
      .birthdays.slice(0, 3)
      .map(({ name, date }) => `${name}: ${date}`)
      .join(', ')
  );

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
