import { Component, ElementRef, output, viewChild } from '@angular/core';
import { PkIconButtonComponent } from './pk-icon-button.component';
import { NgIcon } from '@ng-icons/core';
import { FocusFirstDirective } from './focus-first.directive';
import { focusableSelectors } from '../constants';

@Component({
  selector: 'pk-modal',
  imports: [PkIconButtonComponent, NgIcon, FocusFirstDirective],
  styles: `
    .pk-modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: var(--color-bg-opaque);
      backdrop-filter: blur(2px);
      display: flex;
      justify-content: center;
      z-index: var(--modal-backdrop-z-index);
    }

    .pk-modal {
      position: relative;
      background: var(--color-bg);
      z-index: var(--modal-z-index);
      padding: 0.5rem 0.75rem;
      border-radius: 0;
      overflow: auto;
      width: 100%;
      max-height: 100%;
    }

    @media (min-width: 768px) {
      .pk-modal {
        margin-top: 3rem;
        padding: 1.5rem;
        border-radius: var(--radius-default);
        border: 1px solid var(--color-border);
        width: 768px;
        height: min-content;
        max-height: calc(100% - 6rem);
        -ms-overflow-style: none;
      }
      .pk-modal::-webkit-scrollbar {
        display: none;
      }
    }

    .pk-modal-close-btn {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
    }
  `,
  template: `
    <div class="pk-modal-backdrop" (click)="close.emit()">
      <div
        #modalContainer
        class="pk-modal"
        (click)="$event.stopPropagation()"
        tabindex="-1"
        (keydown)="onKeyDown($event)">
        <pk-icon-button
          class="pk-modal-close-btn"
          tooltip="Close"
          pkFocusFirst
          (click)="close.emit()">
          <ng-icon name="tablerX" size="1.5rem" />
        </pk-icon-button>
        <ng-content></ng-content>
      </div>
    </div>
  `,
})
export class PkModalComponent {
  public close = output<void>();

  public modalContainer = viewChild.required<ElementRef<HTMLElement>>('modalContainer');

  private getFocusableElements(): HTMLElement[] {
    if (!this.modalContainer()) return [];
    return Array.from(
      this.modalContainer().nativeElement.querySelectorAll(focusableSelectors.join(','))
    ).filter(el => (el as HTMLElement).offsetParent !== null) as HTMLElement[];
  }

  public onKeyDown(event: KeyboardEvent) {
    if (event.key !== 'Tab') return;
    const elements = this.getFocusableElements();
    if (!elements.length) return;
    const first = elements[0];
    const last = elements[elements.length - 1];
    const active = document.activeElement;
    if (event.shiftKey) {
      if (active === first) {
        event.preventDefault();
        last.focus();
      }
    } else {
      if (active === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }
}
