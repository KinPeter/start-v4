import { Component, input, output, signal } from '@angular/core';
import { NgStyle } from '@angular/common';

export type PkButtonAccent = 'default' | 'filled' | 'outline' | 'link' | 'subtle';

@Component({
  selector: 'pk-button',
  standalone: true,
  imports: [NgStyle],
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
          border: 1px solid var(--color-primary);
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

        &.icon {
          display: flex;
          align-items: center;
          justify-content: center;
          height: auto;
          width: auto;
          padding: 0.375rem;
          border-radius: 50%;
        }
      }
    `,
  ],
  template: `
    <button
      [type]="type()"
      [disabled]="disabled()"
      [class]="accent()"
      [class.icon]="icon()"
      [class.pressed]="pressed()"
      [ngStyle]="{
        width: icon() ? 'auto' : size() ? size() : 'auto',
        fontSize: !icon() ? 'revert' : size() ? size() : '22px',
      }"
      (click)="click.emit()"
      (mousedown)="pressed.set(true)"
      (mouseup)="pressed.set(false)"
      (keydown)="pressed.set(true)"
      (keyup)="pressed.set(false)"
      (keyup.enter)="click.emit()"
      (keyup.space)="click.emit()">
      @if (loading()) {
        <span>...</span>
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
  public accent = input<PkButtonAccent>('default');
  public icon = input(false);
  public size = input('');

  public pressed = signal(false);

  public click = output<void>();
}
