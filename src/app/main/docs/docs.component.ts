import { Component, effect, signal, Signal, WritableSignal } from '@angular/core';
import { WidgetsBarService } from '../main-menu/widgets-bar.service';
import { NgIcon } from '@ng-icons/core';
import { PkIconButtonComponent } from '../../common/pk-icon-button.component';
import { PkWidgetDirective } from '../../common/pk-widget.directive';
import { PkLoaderComponent } from '../../common/pk-loader.component';
import { PkInputComponent } from '../../common/pk-input.component';
import { PkInputDirective } from '../../common/pk-input.directive';
import { FocusFirstDirective } from '../../common/focus-first.directive';
import { Document, DocumentListItem, DocumentRequest, UUID } from '../../types';
import { DocCardComponent } from './doc-card.component';
import { DocsService } from './docs.service';
import { DocModalComponent } from './doc-modal.component';

@Component({
  selector: 'pk-docs',
  imports: [
    NgIcon,
    PkIconButtonComponent,
    PkWidgetDirective,
    PkLoaderComponent,
    DocCardComponent,
    DocModalComponent,
    PkInputComponent,
    PkInputDirective,
    FocusFirstDirective,
  ],
  providers: [],
  styles: `
    .container {
      min-height: 120px;
    }

    .tags {
      padding: 2px;
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      margin-top: -8px;
      margin-bottom: 8px;
    }

    .tag {
      background-color: var(--color-border);
      color: var(--color-text-secondary);
      font-size: 0.8rem;
      padding: 4px 10px;
      margin-right: 4px;
      border-radius: 12px;

      &:hover {
        color: var(--color-text-accent);
      }
    }

    main .loader {
      margin-top: 5%;
    }

    .search {
      padding: 2px;
    }

    @media (min-width: 430px) {
      .results {
        max-height: 300px;
        overflow-y: auto;
      }
    }
  `,
  template: `
    <div pkWidget class="container">
      <header>
        <h1>Docs</h1>
        <div class="actions">
          @if (results().length !== 0) {
            <pk-icon-button tooltip="Reset filter" (onClick)="results.set([])">
              <ng-icon name="tablerFilterOff" size="1.2rem" />
            </pk-icon-button>
          }
          <pk-icon-button tooltip="Create new document" (onClick)="startNewDoc()" pkFocusFirst>
            <ng-icon name="tablerPlus" size="1.2rem" />
          </pk-icon-button>
          <pk-icon-button tooltip="Close" (onClick)="close()">
            <ng-icon name="tablerX" size="1.2rem" />
          </pk-icon-button>
        </div>
      </header>
      <main>
        @if (loading()) {
          <div class="loader">
            <pk-loader size="sm" />
          </div>
        } @else {
          <div class="search">
            <pk-input width="100%">
              <input
                pkInput
                title="Search"
                placeholder="Search"
                type="text"
                (input)="search($event)" />
            </pk-input>
          </div>
          <div class="tags">
            @for (tag of tags(); track tag) {
              <button class="tag" (click)="filterByTag(tag)">{{ tag }}</button>
            }
          </div>
          <div class="results">
            @for (item of results(); track item.id) {
              <pk-doc-card [item]="item" (open)="openDoc($event)" (delete)="deleteDoc($event)" />
            }
          </div>
        }
      </main>
    </div>

    @if (isModalOpen()) {
      <pk-doc-modal
        [document]="document()"
        [isNew]="isNewDoc()"
        (close)="closeDoc()"
        (save)="saveDoc($event)" />
    }
  `,
})
export class DocsComponent {
  public loading: Signal<boolean>;
  public docs: Signal<DocumentListItem[]>;
  public tags: Signal<string[]>;
  public results: WritableSignal<DocumentListItem[]> = signal([]);
  public document: Signal<Document | null> = signal(null);
  public isModalOpen: WritableSignal<boolean> = signal(false);
  public isNewDoc: WritableSignal<boolean> = signal(false);

  constructor(
    private docsService: DocsService,
    private widgetsBarService: WidgetsBarService
  ) {
    this.docs = this.docsService.docList;
    this.tags = this.docsService.tags;
    this.loading = this.docsService.loading;
    this.document = this.docsService.documentOpen;

    effect(() => {
      if (this.docs()) {
        this.results.set([]);
      }
    });
  }

  public close(): void {
    this.widgetsBarService.toggleDocs();
  }

  public openDoc(id: UUID): void {
    this.docsService.openDocument(id).subscribe({
      next: () => {
        this.isModalOpen.set(true);
      },
    });
  }

  public closeDoc(): void {
    this.docsService.closeDocument();
    this.isNewDoc.set(false);
    this.isModalOpen.set(false);
  }

  public startNewDoc(): void {
    this.closeDoc();
    this.isNewDoc.set(true);
    this.isModalOpen.set(true);
  }

  public saveDoc(doc: DocumentRequest): void {
    if (this.isNewDoc()) {
      this.docsService.createDocument(doc);
    } else if (this.document()?.id) {
      this.docsService.updateDocument(this.document()!.id, doc);
    }
    this.closeDoc();
  }

  public search(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    if (value === ' ') {
      this.results.set([...this.docs()]);
    } else if (value === '') {
      this.results.set([]);
    } else {
      this.results.set(
        this.docs().filter(({ title, tags }) => {
          return (
            title.toLowerCase().includes(value.toLowerCase()) ||
            tags.some(tag => tag.toLowerCase().includes(value.toLowerCase()))
          );
        })
      );
    }
  }

  public filterByTag(tag: string): void {
    this.results.set(this.docs().filter(({ tags }) => tags.includes(tag)));
  }

  public deleteDoc(id: UUID): void {
    this.docsService.deleteDocument(id);
  }
}
