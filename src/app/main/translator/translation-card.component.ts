import { Component, computed, input, signal } from '@angular/core';
import { TranslationResponse } from '@kinpeter/pk-common';
import { PkCardDirective } from '../../common/pk-card.directive';
import { NgIcon } from '@ng-icons/core';
import { PkIconButtonComponent } from '../../common/pk-icon-button.component';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'pk-translation-card',
  imports: [PkCardDirective, NgIcon, PkIconButtonComponent],
  providers: [],
  styles: `
    .section {
      > div {
        display: flex;
        align-items: center;
        gap: 0.35rem;

        > span {
          text-transform: uppercase;
          font-size: 0.8rem;
          position: relative;
          top: -2px;
        }
      }

      > p {
        padding: 0 0.75rem 0.35rem;
        font-size: 1.1rem;
        line-height: 1.6;
      }
    }

    .translation > p {
      .copy-button {
        display: none;
      }

      &:hover {
        .copy-button {
          display: inline-block;
        }
      }
    }

    pk-icon-button {
      display: inline-block;
    }
  `,
  template: `
    <div pkCard class="card">
      <div class="section original">
        <div>
          <pk-icon-button tooltip="Read out" (onClick)="readOut(sourceLang(), original())">
            <ng-icon name="tablerVolume" size="1.2rem" />
          </pk-icon-button>
          <span>{{ sourceLang() }}</span>
        </div>
        <p>{{ original() }}</p>
      </div>
      <hr />
      <div class="section translation">
        <div>
          <pk-icon-button tooltip="Read out" (onClick)="readOut(targetLang(), translation())">
            <ng-icon name="tablerVolume" size="1.2rem" />
          </pk-icon-button>
          <span>{{ targetLang() }}</span>
        </div>
        <p>
          {{ translation() }}
          <pk-icon-button class="copy-button" tooltip="Copy" (onClick)="copy()">
            <ng-icon [name]="showCheckmark() ? 'tablerCheck' : 'tablerCopy'" size="0.9rem" />
          </pk-icon-button>
        </p>
      </div>
    </div>
  `,
})
export class TranslationCardComponent {
  public result = input.required<TranslationResponse>();
  public showCheckmark = signal(false);

  public sourceLang = computed(() => this.result().sourceLang);
  public targetLang = computed(() => this.result().targetLang);
  public translation = computed(() => this.result().translation);
  public original = computed(() => this.result().original);

  private langWithWarning = '';

  constructor(private notificationService: NotificationService) {}

  public readOut(lang: string, text: string): void {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;

    const voices = window.speechSynthesis.getVoices();
    const matchingVoices = voices.filter(voice =>
      voice.lang.toLowerCase().startsWith(lang.toLowerCase())
    );

    if (matchingVoices.length > 0) {
      const randomIndex = Math.floor(Math.random() * matchingVoices.length);
      utterance.voice = matchingVoices[randomIndex];
    } else {
      if (this.langWithWarning === lang) {
        return;
      }
      this.notificationService.showWarning(
        'Your current browser does not support the selected language for text readout.'
      );
      this.langWithWarning = lang;
    }

    window.speechSynthesis.speak(utterance);
  }

  public async copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.result().translation);
      this.showCheckmark.set(true);
      setTimeout(() => {
        this.showCheckmark.set(false);
      }, 3000);
    } catch (_e) {
      this.notificationService.showError('Could not copy to clipboard.');
    }
  }
}
