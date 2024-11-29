import { Component, input } from '@angular/core';
import { Note } from '@kinpeter/pk-common';
import { NgIcon } from '@ng-icons/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'pk-note',
  standalone: true,
  imports: [NgIcon, NgClass],
  providers: [],
  styles: `
    .card {
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      padding: 0.5rem;
      background-color: var(--color-bg-lighter);
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
      white-space: pre-wrap;

      ul {
        list-style-type: none;
      }

      a {
        color: var(--color-text-accent);
        text-decoration: none;
      }

      &.pinned {
        border-color: var(--color-text);
      }

      &.archived {
        opacity: 0.6;
      }
    }
  `,
  template: `
    <div class="card" [ngClass]="{ pinned: note()?.pinned, archived: note()?.archived }">
      @if (note()?.text) {
        <p class="text">
          {{ note()?.text }}
        </p>
      }
      @if (note()?.links?.length) {
        <ul class="links">
          @for (link of note()?.links; track link.url) {
            <li>
              <a [href]="link.url" target="_blank">
                <ng-icon name="tablerLink" />
                {{ link.name }}</a
              >
            </li>
          }
        </ul>
      }
    </div>
  `,
})
export class NoteComponent {
  public note = input<Note>();
}
