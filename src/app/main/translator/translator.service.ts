import { computed, Injectable } from '@angular/core';
import { Store } from '../../utils/store';
import { DeeplLanguage, TranslationRequest, TranslationResponse } from '@kinpeter/pk-common';
import { NotificationService } from '../../services/notification.service';
import { ApiService } from '../../services/api.service';
import { ApiRoutes } from '../../constants';

interface TranslatorState {
  loading: boolean;
  result: TranslationResponse | null;
  validationError: string | null;
}

const initialState: TranslatorState = {
  loading: false,
  result: null,
  validationError: null,
};

@Injectable({ providedIn: 'root' })
export class TranslatorService extends Store<TranslatorState> {
  private readonly translateQueryRegex = /^([a-zA-Z]{2})([a-zA-Z]{2}):\s?(.*)$/;
  private readonly availableLanguages = Object.values(DeeplLanguage);

  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService
  ) {
    super(initialState);
  }

  public loading = computed(() => this.state().loading);
  public result = computed(() => this.state().result);
  public validationError = computed(() => this.state().validationError);

  public getTranslation(query: string): void {
    const match = query.match(this.translateQueryRegex);
    this.setState({ validationError: null });

    if (!match || !match[3]?.trim().length) {
      console.log('no match');
      return;
    }

    const sourceLang = match[1].toLowerCase();
    const targetLang = match[2].toLowerCase();
    const text = match[3].trim();
    console.log('match', { sourceLang, targetLang, text });
    console.log(this.availableLanguages);

    if (!this.availableLanguages.includes(sourceLang as DeeplLanguage)) {
      this.setState({ validationError: `Invalid source language: ${sourceLang.toUpperCase()}` });
      return;
    }

    if (!this.availableLanguages.includes(targetLang as DeeplLanguage)) {
      this.setState({ validationError: `Invalid target language: ${targetLang.toUpperCase()}` });
      return;
    }

    this.setState({ loading: true });
    this.apiService
      .post<
        TranslationRequest,
        TranslationResponse
      >(ApiRoutes.PROXY_TRANSLATE, { sourceLang, targetLang, text })
      .subscribe({
        next: res => {
          this.setState({
            result: res,
            loading: false,
          });
        },
        error: err => {
          this.notificationService.showError('Could not fetch translation. ' + err.message);
          this.setState({ loading: false });
        },
      });
  }
}
