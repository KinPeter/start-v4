import { AfterViewInit, Component, ElementRef, OnDestroy, viewChild } from '@angular/core';
import { PkInputComponent } from '../../common/pk-input.component';
import { PkInputDirective } from '../../common/pk-input.directive';
import { MainManagerService } from '../main-manager.service';
import { GlobalSearchService } from './global-search.service';

@Component({
  selector: 'pk-search-bar',
  imports: [PkInputComponent, PkInputDirective],
  providers: [],
  styles: ``,
  template: `
    <pk-input width="100%">
      <input
        pkInput
        type="text"
        placeholder="Search anything"
        #searchInput
        (input)="onInput($event)" />
    </pk-input>
  `,
})
export class SearchBarComponent implements AfterViewInit, OnDestroy {
  public input = viewChild.required<ElementRef<HTMLInputElement>>('searchInput');

  private debounceTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private mainManagerService: MainManagerService,
    private globalSearchService: GlobalSearchService
  ) {}

  public ngAfterViewInit(): void {
    this.input().nativeElement.focus();
    this.input().nativeElement.addEventListener('keyup', this.keyUpHandler.bind(this));
  }

  public ngOnDestroy(): void {
    this.input().nativeElement.removeEventListener('keyup', this.keyUpHandler.bind(this));
  }

  public onInput(event: Event): void {
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }
    this.debounceTimeout = setTimeout(() => {
      const target = event.target as HTMLInputElement;
      this.globalSearchService.search(target.value);
    }, 300);
  }

  private keyUpHandler(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.mainManagerService.closeSearch();
    }
  }
}
