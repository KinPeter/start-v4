import { Component, input, output, signal } from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';
import { PkLoaderComponent } from './pk-loader.component';

export type PkButtonVariant = 'default' | 'filled' | 'outline' | 'link' | 'subtle';

@Component({
  selector: 'pk-button',
  standalone: true,
  imports: [NgStyle, PkLoaderComponent, NgClass],
  styles: [
    `
      button {
        background-color: var(--color-bg);
        color: var(--color-white);
        font-weight: 700;
        border: 1px solid var(--color-border);
        border-radius: var(--radius-default);
        height: 2.25rem;
        padding: 0 1.5rem;
        display: block;
        cursor: pointer;

        &:hover {
          background-color: var(--color-border);
        }

        &:focus-visible {
          outline: none;
          box-shadow: var(--focus-box-shadow);
        }

        &:disabled {
          color: var(--color-text-disabled);
          cursor: not-allowed;

          &:hover {
            background-color: var(--color-bg);
          }
        }

        &.pressed {
          position: relative;
          top: 1px;
        }

        &.filled {
          border: none;
          background-color: var(--color-primary);

          &:hover {
            background-color: var(--color-primary-hover);
          }

          &:disabled {
            background-color: var(--color-bg);
          }
        }

        &.outline {
          border-color: var(--color-primary);
          color: var(--color-primary);

          &:hover {
            background-color: var(--color-primary-outline-hover);
          }

          &:disabled {
            color: var(--color-text-disabled);

            &:hover {
              background-color: var(--color-bg);
            }
          }
        }

        &.subtle {
          background-color: transparent;
          color: var(--color-primary);
          border: none;

          &:hover {
            background-color: var(--color-primary-outline-hover);
          }

          &:disabled {
            color: var(--color-text-disabled);

            &:hover {
              background-color: var(--color-bg);
            }
          }
        }

        &.link {
          background-color: transparent;
          color: var(--color-primary);
          border: none;

          &:hover {
            text-decoration: underline;
          }

          &:disabled {
            color: var(--color-text-disabled);

            &:hover {
              background-color: transparent;
            }
          }
        }

        &.icon {
          display: flex;
          align-items: center;
          justify-content: center;
          height: auto;
          width: auto;
          padding: 0.375rem;
          border-radius: 50%;
        }

        &.loading {
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    `,
  ],
  template: `
    <button
      [type]="type()"
      [disabled]="disabled()"
      [class]="variant()"
      [ngClass]="{
        icon: icon(),
        pressed: pressed(),
        loading: loading(),
      }"
      [ngStyle]="{
        width: icon() ? 'auto' : size() ? size() : 'auto',
        fontSize: !icon() ? 'revert' : size() ? size() : '22px',
      }"
      (click)="onClick.emit()"
      (mousedown)="pressed.set(true)"
      (mouseup)="pressed.set(false)"
      (keydown)="pressed.set(true)"
      (keyup)="pressed.set(false)"
      (keyup.enter)="onClick.emit()"
      (keyup.space)="onClick.emit()">
      @if (loading()) {
        <pk-loader
          [size]="icon() ? 'xs' : 'sm'"
          [style]="icon() ? 'position: relative; top: -0.25rem' : undefined" />
      } @else {
        <ng-content></ng-content>
      }
    </button>
  `,
})
export class PkButtonComponent {
  public disabled = input(false);
  public type = input('button');
  public loading = input(false);
  public variant = input<PkButtonVariant>('default');
  public icon = input(false);
  public size = input('');

  public pressed = signal(false);

  public onClick = output<void>();
}
