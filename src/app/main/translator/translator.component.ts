import { Component, OnDestroy, Signal } from '@angular/core';
import { WidgetsBarService } from '../main-menu/widgets-bar.service';
import { NgIcon } from '@ng-icons/core';
import { PkIconButtonComponent } from '../../common/pk-icon-button.component';
import { PkWidgetDirective } from '../../common/pk-widget.directive';
import { DeeplLanguage, TranslationResponse } from '@kinpeter/pk-common';
import { PkLoaderComponent } from '../../common/pk-loader.component';
import { PkInputComponent } from '../../common/pk-input.component';
import { PkInputDirective } from '../../common/pk-input.directive';
import { FocusFirstDirective } from '../../common/focus-first.directive';
import { TranslatorService } from './translator.service';
import { TranslationCardComponent } from './translation-card.component';

@Component({
  selector: 'pk-translator',
  imports: [
    NgIcon,
    PkIconButtonComponent,
    PkWidgetDirective,
    PkLoaderComponent,
    PkInputComponent,
    PkInputDirective,
    FocusFirstDirective,
    TranslationCardComponent,
  ],
  providers: [],
  styles: `
    .container {
      min-height: 120px;
    }

    main .loader {
      margin: 1rem 0 2rem;
    }

    .input-wrapper {
      padding: 2px;
    }
  `,
  template: `
    <div pkWidget class="container">
      <header>
        <h1>Translator</h1>
        <div class="actions">
          <pk-icon-button tooltip="Close" (onClick)="close()" pkFocusFirst>
            <ng-icon name="tablerX" size="1.2rem" />
          </pk-icon-button>
        </div>
      </header>
      <main>
        <div class="input-wrapper">
          <pk-input width="100%" [error]="validationError() ?? ''">
            <input
              pkInput
              [title]="tooltip"
              [disabled]="loading()"
              placeholder="<langs>: <text to translate>"
              type="text"
              (keyup.enter)="onInput($event)" />
          </pk-input>
        </div>
        @if (loading()) {
          <div class="loader">
            <pk-loader size="sm" />
          </div>
        } @else if (result()) {
          <pk-translation-card [result]="result()!" />
        }
      </main>
    </div>
  `,
})
export class TranslatorComponent implements OnDestroy {
  public loading: Signal<boolean>;
  public result: Signal<TranslationResponse | null>;
  public validationError: Signal<string | null>;
  public tooltip = `Available languages: ${Object.keys(DeeplLanguage).join(', ')}`;

  constructor(
    private widgetsBarService: WidgetsBarService,
    private translatorService: TranslatorService
  ) {
    this.loading = this.translatorService.loading;
    this.result = this.translatorService.result;
    this.validationError = this.translatorService.validationError;
  }

  public close(): void {
    this.widgetsBarService.toggleTranslator();
  }

  public onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.translatorService.getTranslation(target.value);
  }

  public ngOnDestroy() {
    this.translatorService.reset();
  }
}
