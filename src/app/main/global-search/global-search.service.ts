import { computed, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { ShortcutsService } from '../shortcuts/shortcuts.service';
import { NotesService } from '../notes/notes.service';
import { PersonalDataService } from '../personal-data/personal-data.service';
import { BirthdaysService } from '../birthdays/birthdays.service';
import { Note, Shortcut, PersonalData, BirthdayItem, DocumentListItem } from '../../types';
import { DocsService } from '../docs/docs.service';

export interface GlobalSearchResult {
  notes: Note[];
  shortcuts: Shortcut[];
  personalData: PersonalData[];
  birthdays: BirthdayItem[];
  docs: DocumentListItem[];
}

@Injectable({ providedIn: 'root' })
export class GlobalSearchService {
  public results: WritableSignal<GlobalSearchResult> = signal({
    notes: [],
    shortcuts: [],
    personalData: [],
    birthdays: [],
    docs: [],
  });

  private shortcuts: Signal<Shortcut[]>;
  private notes: Signal<Note[]>;
  private personalData: Signal<PersonalData[]>;
  private birthdays: Signal<BirthdayItem[]>;
  private docs: Signal<DocumentListItem[]>;

  constructor(
    private shortcutsService: ShortcutsService,
    private notesService: NotesService,
    private personalDataService: PersonalDataService,
    private birthdaysService: BirthdaysService,
    private docsService: DocsService
  ) {
    this.shortcuts = computed(() => Object.values(this.shortcutsService.shortcuts()).flat());
    this.notes = this.notesService.notes;
    this.personalData = this.personalDataService.data;
    this.birthdays = this.birthdaysService.allBirthdays;
    this.docs = this.docsService.docList;
  }

  public search(rawQuery: string): void {
    const query = rawQuery.trim().toLocaleLowerCase();

    if (!query) {
      this.results.set({
        notes: [],
        shortcuts: [],
        personalData: [],
        birthdays: [],
        docs: [],
      });
      return;
    }

    const results: GlobalSearchResult = {
      notes: this.notes().filter(
        ({ text, links }) =>
          text?.toLowerCase().includes(query) ||
          links?.some(l => l.name.toLowerCase().includes(query))
      ),
      shortcuts: this.shortcuts().filter(({ name }) => name.toLowerCase().includes(query)),
      personalData: this.personalData().filter(({ name }) => name.toLowerCase().includes(query)),
      birthdays: this.birthdays().filter(({ name }) => name.toLowerCase().includes(query)),
      docs: this.docs().filter(({ title }) => title.toLowerCase().includes(query)),
    };

    this.results.set(results);
  }

  public clearResults(): void {
    this.results.set({
      notes: [],
      shortcuts: [],
      personalData: [],
      birthdays: [],
      docs: [],
    });
  }
}
